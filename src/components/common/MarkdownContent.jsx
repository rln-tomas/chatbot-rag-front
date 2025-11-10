import ReactMarkdown from "react-markdown";

function MarkdownContent({ children, className = "" }) {
  return (
    <ReactMarkdown
      className={className}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ inline, children }) =>
          inline ? (
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600">
              {children}
            </code>
          ) : (
            <code className="block bg-gray-800 text-gray-100 p-3 rounded text-sm font-mono overflow-x-auto my-2">
              {children}
            </code>
          ),
        pre: ({ children }) => <pre className="my-2">{children}</pre>,
        ul: ({ children }) => (
          <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside my-2 space-y-1">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="ml-2">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {children}
          </a>
        ),
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold my-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold my-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold my-2">{children}</h3>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

export default MarkdownContent;
