import React from "react";

import { cn } from "@kkhys/ui/utils";
import { CopyButton } from "#/app/posts/_ui/blocks/code-block/copy-button";

const CodeHeader = ({ title }: { title: string }) => (
  <div className="flex flex-wrap items-start rounded-t-md border-b border-white/10 bg-zinc-800 px-4 dark:bg-zinc-900">
    <h3 className="my-0 mr-auto py-3.5 font-mono text-xs font-medium text-zinc-300">
      {title}
    </h3>
  </div>
);

const CodePanel = ({
  children,
  hasTitle = false,
  __rawString__,
}: {
  children: React.ReactNode;
  hasTitle?: boolean;
  __rawString__?: string;
}) => {
  const child = React.Children.only(children);
  if (React.isValidElement(child)) {
    __rawString__ =
      // @ts-expect-error
      (child.props?.__rawString__ as string | undefined) ?? __rawString__;
  }

  if (!__rawString__) {
    throw new Error(
      "`CodePanel` requires a `code` prop, or a child with a `code` prop.",
    );
  }

  const isShowLineNumbers =
    // @ts-expect-error
    typeof child?.props?.children?.props?.["data-line-numbers"] !== "undefined";

  return (
    <div className="group max-h-[650px] overflow-x-auto">
      <pre>
        <code className={cn("grid", isShowLineNumbers && "show-line-numbers")}>
          {/* @ts-expect-error */}
          {child.props.children.props.children}
        </code>
      </pre>
      <CopyButton value={__rawString__} hasTitle={hasTitle} />
    </div>
  );
};

export const CodeBlock = ({
  children,
  ...props
}: {
  children: React.ReactNode | React.ReactNode[];
  title?: string;
  raw?: string;
  "data-rehype-pretty-code-figure"?: string;
}) => {
  const containerClassName =
    "relative overflow-hidden rounded-md bg-[#131316] shadow-md dark:border code-block";

  if (!Array.isArray(children))
    return (
      <div className={containerClassName}>
        <CodePanel {...props}>{children}</CodePanel>
      </div>
    );

  // @ts-expect-error
  const title = children[0]?.props?.children as string | undefined;
  const hasTitle = typeof title !== "undefined";

  return (
    <div className={containerClassName}>
      {title && <CodeHeader title={title} />}
      <CodePanel hasTitle={hasTitle} {...props}>
        {children[1]}
      </CodePanel>
    </div>
  );
};
