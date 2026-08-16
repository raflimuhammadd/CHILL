function CountdownBox({ hours = 0, mins = 0, secs = 0 }) {
  const showHours = Number(hours) > 0;
  return (
    <div className="mb-10 rounded-2xl bg-[#2F3334] p-8 text-center shadow-2xl">
      <p className="mb-4 text-lg font-semibold text-white/70">
        Lakukan Pembayaran Sebelum Waktu Habis
      </p>
      <div className="flex justify-center items-center gap-2 md:gap-4">
        {showHours && (
          <>
            <div className="flex flex-col">
              <div className="text-4xl md:text-5xl font-bold font-mono">
                {hours}
              </div>
              <span className="text-xs md:text-sm text-white/50">Jam</span>
            </div>
            <span className="text-4xl md:text-5xl font-bold">:</span>
          </>
        )}
        <div className="flex flex-col">
          <div className="text-4xl md:text-5xl font-bold font-mono">
            {mins}
          </div>
          <span className="text-xs md:text-sm text-white/50">Menit</span>
        </div>
        <span className="text-4xl md:text-5xl font-bold">:</span>
        <div className="flex flex-col">
          <div className="text-4xl md:text-5xl font-bold font-mono">
            {secs}
          </div>
          <span className="text-xs md:text-sm text-white/50">Detik</span>
        </div>
      </div>
      <p className="mt-6 text-sm text-white/40">
        Waktu akan terus berjalan meskipun Anda menutup halaman ini
      </p>
    </div>
  );
}

export default CountdownBox;