const mongoose = require("mongoose");
const router = require("express").Router();
const { auth } = require("../../middlewares");
const { ResponseHandler } = require("../../utils");
const Session = mongoose.model("Session");
const { openai } = require("../../utils/openGpt");


async function createSessionWithAssessment(userId, form) {
    const newSession = await Session({
        sender: userId,
        assesment: {
            skinType: form?.skinType,
            mainConcern: form?.mainConcern,
            additionalSkinConcerns: form?.additionalSkinConcerns,
            alcoholConsumption: form?.alcoholConsumption,
            climateType: form?.climateType,
            currentRoutine: form?.currentRoutine,
            dietType: form?.dietType,
            exerciseFrequency: form?.exerciseFrequency,
            sunscreenUsage: form?.sunscreenUsage,
            skinTextureDescription: form?.skinTextureDescription,
            productUsageFrequency: form?.productUsageFrequency,
            stressLevel: form?.stressLevel,
            sunExposure: form?.sunExposure,
            waterIntake: form?.waterIntake,
            workEnvironment: form?.workEnvironment,
            specificSkinIssues: form?.specificSkinIssues,
        },
        messages: [],
    });
    await newSession.save();
    return newSession;
}

/**
 * Builds the system prompt that tells AI how to respond
 * This includes user's skin assessment data and instructions
 */
function buildSystemPrompt(assesment, message) {
    return `You are an AI Medical Assistant specializing in skincare. Your role is to provide personalized skincare advice based on the user's assessment data and their ongoing queries.

### Key Principles:
1. **Response Format**: Always respond in clean Markdown format. Use markdown for:
   - Headings (##, ###)
   - Bold text (**text**)
   - Lists (- or 1.)
   - Code blocks when needed (\`code\`)
   
2. **Solution-First Approach**: Prioritize providing helpful solutions rather than asking excessive questions.

3. **Product Recommendations**: Recommend specific products available in Pakistan with:
   - Product name
   - Key ingredients
   - How to use
   - Price ranges when possible

4. **Response Structure**: 
   - Use headings for sections (## Morning Routine, ## Evening Routine)
   - Use numbered lists for steps
   - Use bullet points for features/benefits
   - Keep responses concise but detailed when needed

### User's Assessment Data:
**Skin Type:** ${assesment?.skinType || "Not specified"}
**Main Concern:** ${assesment?.mainConcern || "Not specified"}
**Additional Concerns:** ${assesment?.additionalSkinConcerns || "None mentioned"}
**Specific Issues:** ${assesment?.specificSkinIssues?.join(", ") || "None specified"}
**Current Routine:** ${assesment?.currentRoutine || "Not specified"}
**Sunscreen Usage:** ${assesment?.sunscreenUsage || "Not specified"}
**Climate:** ${assesment?.climateType || "Not specified"}
**Work Environment:** ${assesment?.workEnvironment || "Not specified"}
**Product Usage Frequency:** ${assesment?.productUsageFrequency || "Not specified"}
**Skin Texture:** ${assesment?.skinTextureDescription || "Not specified"}

### User's Current Question:
${message}

Remember: Format your response in clean Markdown. Use headings, lists, and bold text appropriately for better readability.`;
}

/**
 * Gets AI response from OpenAI based on user's message and chat history
 */
async function generateAssistantReply(foundSession, userMessage) {
    // Get last 6 messages (3 user + 3 assistant) for context
    const previousMessages = foundSession.messages.slice(-6).map((msg) => ({
        role: msg.question ? "user" : "assistant",
        content: msg.question || msg.answer,
    }));
    
    // Build the prompt with user's assessment data
    const systemPrompt = buildSystemPrompt(foundSession.assesment, userMessage);
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            { role: "system", content: systemPrompt },
            ...previousMessages,
            { role: "user", content: userMessage },
        ],
        temperature: 0.7,
    });
    
    // Return raw markdown - frontend will render it properly
    return response.choices[0].message.content;
}

/**
 * Generates initial welcome message based on user's skin concern
 */
function getInitialRecommendations(mainConcern, skinType) {
    const recommendations = {
        'Acne': `### Quick Recommendations for Acne Concerns

1. **Cleanser:** Neutrogena Oil-Free Acne Wash (contains salicylic acid to clear pores)
2. **Treatment:** Clean & Clear Advantage Spot Treatment (for targeted application)
3. **Moisturizer:** Simple Oil-Free Moisturizer (won't clog pores)
4. **Habit:** Change pillowcases 2-3 times weekly to reduce bacteria contact`,
        
        'Aging': `### Quick Recommendations for Aging Concerns

1. **Cleanser:** L'Oreal Men Expert Anti-Aging Face Wash
2. **Treatment:** Pond's Age Miracle Day Cream (contains retinol alternatives)
3. **Protection:** Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 50+
4. **Habit:** Apply moisturizer immediately after washing while skin is still slightly damp`,
        
        'Sensitivity': `### Quick Recommendations for Sensitive Skin

1. **Cleanser:** Cetaphil Gentle Skin Cleanser (fragrance-free, non-irritating)
2. **Moisturizer:** QV Face Sensitive Moisturizer (hypoallergenic)
3. **Shaving:** Gillette SkinGuard Sensitive Razor with Nivea Sensitive Shaving Gel
4. **Habit:** Patch test new products on your inner arm for 24 hours before facial application`,
        
        'Uneven Tone': `### Quick Recommendations for Uneven Skin Tone

1. **Cleanser:** Garnier Men PowerWhite Anti-Pollution Double Action Face Wash
2. **Treatment:** Fair & Lovely Men (contains niacinamide for brightening)
3. **Protection:** Vaseline Healthy Bright Sun + Pollution Protection SPF 30
4. **Habit:** Exfoliate gently twice weekly to remove dead skin cells`,
        
        'Oiliness': `### Quick Recommendations for Oily Skin

1. **Cleanser:** Himalaya Purifying Neem Face Wash (controls excess oil)
2. **Treatment:** Clean & Clear Oil Control Film (for midday oil absorption)
3. **Moisturizer:** Neutrogena Hydro Boost Water Gel (oil-free hydration)
4. **Habit:** Use clay masks weekly to deep clean and reduce sebum production`,
    };
    
    return recommendations[mainConcern] || `### Quick Recommendations Based on Your Profile

1. **Cleanser:** A gentle face wash suited for your ${skinType || "skin type"}
2. **Protection:** Daily sunscreen with at least SPF 30
3. **Hydration:** Lightweight moisturizer appropriate for Pakistani climate
4. **Habit:** Drink at least 8 glasses of water daily for skin hydration from within`;
}

// ===================================================================
// API ROUTES
// ===================================================================

/**
 * GET /api/session/user-sessions
 * Get all chat sessions for the logged-in user
 */
router.get("/user-sessions", auth.required, auth.user, async (req, res) => {
    try {
        const sessions = await Session.find({ sender: req.user._id })
            .sort({ createdAt: -1 });
        return ResponseHandler.ok(res, sessions);
    } catch (err) {
        return ResponseHandler.badRequest(res, err.message);
    }
});

/**
 * GET /api/session/:sessionId/messages
 * Get all messages for a specific chat session
 */
router.get("/:sessionId/messages", auth.required, auth.user, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await Session.findById(sessionId);
        
        if (!session) {
            return ResponseHandler.badRequest(res, "Session not found");
        }
        
        return ResponseHandler.ok(res, { messages: session.messages });
    } catch (err) {
        return ResponseHandler.badRequest(res, err.message);
    }
});

/**
 * POST /api/session/start
 * Create a new chat session with assessment data and generate initial welcome message
 */
router.post("/start", auth.required, auth.user, async (req, res) => {
    try {
        const { form } = req.body;
        
        if (!form) {
            return ResponseHandler.badRequest(res, "Missing required parameters");
        }

        // Step 1: Create session with assessment data
        const session = await createSessionWithAssessment(req.user._id, form);
        const assesment = session.assesment;

        // Step 2: Build initial welcome message
        const specificIssuesText = assesment.specificSkinIssues?.length > 0
            ? assesment.specificSkinIssues.join(', ')
            : '';

        const initialRecommendations = getInitialRecommendations(
            assesment.mainConcern,
            assesment.skinType
        );

        const initialResponse = {
            question: null,
            answer: `## Your Skin Assessment Analysis

Based on your assessment, here's what I understand about your skin profile:

**Skin Type:** ${assesment.skinType || "Not specified"}  
**Main Concern:** ${assesment.mainConcern || "Not specified"}  
${specificIssuesText ? `**Specific Issues:** ${specificIssuesText}\n\n` : ''}
**Current Routine:** ${assesment.currentRoutine || "Not specified"}  
**Environment:** ${assesment.workEnvironment || "Not specified"} work environment, ${assesment.climateType || "unspecified"} climate  
**Lifestyle:** ${assesment.exerciseFrequency || "Unspecified"} exercise, ${assesment.stressLevel || "unspecified"} stress levels

---

${initialRecommendations}

---

## What would you like to focus on?

You can ask me about:

- Detailed recommendations for your ${assesment.mainConcern || "skin concerns"}
- Daily skincare routine suggestions for your skin type
- Specific products available in Pakistan for your concerns
- How to address ${specificIssuesText || "your specific skin issues"}
- Diet and lifestyle adjustments for better skin

How can I help you improve your skin today?`,
            isUser: false,
        };

        // Step 3: Save initial message to session
        session.messages.push(initialResponse);
        await session.save();

        return ResponseHandler.ok(res, session);
    } catch (err) {
        return ResponseHandler.badRequest(res, err.message);
    }
});

/**
 * POST /api/session/message
 * Send a message in a chat session and get AI response
 */
router.post("/message", auth.required, auth.user, async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        
        // Validate input
        if (!sessionId || !message) {
            return ResponseHandler.badRequest(res, "Missing sessionId or message");
        }
        
        if (message.length > 500) {
            return ResponseHandler.badRequest(res, "Message is too long. Please limit your question to 500 characters.");
        }

        // Find the session
        const foundSession = await Session.findById(sessionId);
        if (!foundSession) {
            return ResponseHandler.badRequest(res, "Session not found");
        }

        // Get AI response
        const aiResponse = await generateAssistantReply(foundSession, message);

        // Save user message
        foundSession.messages.push({ 
            question: message, 
            answer: null, 
            isUser: true 
        });
        
        // Save AI response
        foundSession.messages.push({ 
            question: null, 
            answer: aiResponse, 
            isUser: false 
        });

        // Limit message history (keep last 150 messages)
        if (foundSession.messages.length > 200) {
            foundSession.messages = foundSession.messages.slice(-150);
        }

        await foundSession.save();

        return ResponseHandler.ok(res, { 
            answer: aiResponse, 
            sessionId: foundSession._id 
        });
    } catch (err) {
        return ResponseHandler.badRequest(res, "Error processing your request");
    }
});

/**
 * POST /api/session/generate-report/:sessionId
 * Generate a comprehensive skincare report based on chat history
 */
router.post('/generate-report/:sessionId', auth.required, auth.user, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { messages } = req.body;

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).send({ message: "Session not found" });
        }

        // Build prompt for report generation
        const systemPrompt = `You are a skincare assistant. Based on the following chat context and user profile, generate a detailed skincare report in Markdown format:

### User Profile:
- Skin Type: ${session.assesment.skinType}
- Main Concern: ${session.assesment.mainConcern}
- Additional Concerns: ${session.assesment.additionalSkinConcerns}
- Specific Issues: ${session.assesment.specificSkinIssues?.join(", ") || "None specified"}
- Current Routine: ${session.assesment.currentRoutine || "Not specified"}
- Sunscreen Usage: ${session.assesment.sunscreenUsage || "Not specified"}

### Chat History:
${messages.map(msg => msg.isUser ? `User: ${msg.question}` : `Assistant: ${msg.answer}`).join("\n")}

### Report:
Generate a comprehensive skincare report including product recommendations, precautionary measures, routines, and tips. Format in clean Markdown.`;

        // Call OpenAI to generate report
        const response = await openai.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "system", content: systemPrompt }],
            temperature: 0.7,
        });

        const report = response.choices[0].message.content;

        return res.status(200).json({ formattedResponse: report });

    } catch (err) {
        console.error("Error generating report:", err);
        return res.status(500).send({ message: "Error generating report" });
    }
});

/**
 * DELETE /api/session/:id
 * Delete a chat session
 */
router.delete("/:id", auth.required, auth.user, async (req, res) => {
    try {
        const sessionId = req.params.id;
        const session = await Session.findByIdAndDelete(sessionId);

        if (!session) {
            return ResponseHandler.badRequest(res, "Session not found");
        }

        return ResponseHandler.ok(res, "Session deleted successfully");
    } catch (err) {
        return ResponseHandler.badRequest(res, err.message);
    }
});

module.exports = router;
