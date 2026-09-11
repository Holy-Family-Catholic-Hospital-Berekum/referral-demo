import { useRef, useState } from "react";

export default function SignaturePad({ onSave, saving }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasStroke, setHasStroke] = useState(false);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return {
      x: ((point.clientX - rect.left) / rect.width) * canvas.width,
      y: ((point.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#253d98";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
    setHasStroke(true);
  };

  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasStroke(false);
  };

  const save = () => {
    if (!hasStroke) return;
    onSave(canvasRef.current.toDataURL("image/png"));
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        className="w-full touch-none rounded-md border border-slate-300 bg-white"
      />
      <div className="mt-2 flex items-center gap-2">
        <button type="button" onClick={clear} className="text-xs text-slate-500 hover:text-slate-700">
          Clear
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!hasStroke || saving}
          className="ml-auto rounded-md bg-[#2F6F62] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#265a50] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Signature"}
        </button>
      </div>
    </div>
  );
}
