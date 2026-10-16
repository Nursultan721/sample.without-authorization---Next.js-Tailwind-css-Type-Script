"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
    
  useEffect(() => {
         console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="font-[family-name:var(--font-unbounded)] text-2xl md:text-3xl font-bold text-stone-900 mb-4">
        Что-то пошло не так!
      </h2>
      <p className="text-stone-600 mb-6 max-w-md">
        Произошла непредвиденная ошибка при загрузке страницы.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-stone-900 text-[#E9E6DF] rounded-full hover:bg-stone-800 transition-all font-medium"
      >
        Попробовать снова
      </button>
    </div>
  );
}
