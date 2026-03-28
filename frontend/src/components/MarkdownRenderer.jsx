import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="markdown-content prose prose-sm md:prose-base max-w-none 
      prose-headings:font-semibold prose-headings:text-gray-900 
      prose-p:text-gray-800 prose-p:leading-7 prose-p:my-3
      prose-strong:text-gray-900 prose-strong:font-semibold
      prose-ul:text-gray-800 prose-ul:my-3 prose-ul:list-disc prose-ul:pl-6
      prose-ol:text-gray-800 prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-6
      prose-li:text-gray-800 prose-li:my-1
      prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
      prose-pre:bg-gray-900 prose-pre:text-gray-100
      prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
      prose-a:text-blue-600 prose-a:underline break-words">
      <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>
        {content || ""}
      </Markdown>
    </div>
  );
};

export default MarkdownRenderer;


