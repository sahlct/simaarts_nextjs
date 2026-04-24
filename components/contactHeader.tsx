"use client";

export default function ContactHeader({ data }: any) {
  return (
    <section
      style={{
        background: `linear-gradient(to right, ${data.colorleft}, ${data.colorright})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 text-center">
        {/* TITLE */}
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
          {data.title}
        </h1>

        {/* DIVIDER */}
        <div className="md:w-96 w-52 h-[1px] bg-gray-800 mx-auto mb-4" />

        {/* SUBTITLE */}
        <p className="text-sm md:text-base text-gray-800">
          {data.subtitle}
        </p>
      </div>
    </section>
  );
}
