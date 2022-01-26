export default function Box({ title, content, includeBorder = true }) {
  return (
    <div
      className={"overflow-hidden" + (includeBorder && " border border-white")}
    >
      <h2 className="font-mono py-4 bg-black text-white border-b border-kong-border font-bold">
        {title}
      </h2>
      <div className="px-4 py-2 sm:px-8 text-white bg-black">{content}</div>
    </div>
  );
}
