export function C2paButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`
        w-full h-[42px] rounded-full
        border-2 border-[#666]
        bg-white
        font-bold text-[16px] text-[#666]
        cursor-pointer
        transition-all duration-150 ease-in-out
        hover:bg-[#111] hover:border-[#111] hover:text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.14)]
        focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#111]/25 focus-visible:outline-offset-3
        ${props.className ?? ""}
      `}
    />
  );
}