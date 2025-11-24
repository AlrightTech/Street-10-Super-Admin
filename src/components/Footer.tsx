/**
 * Footer component with logo, social icons, and contact info
 */
export default function Footer() {
  return (
    <footer className="bg-[#3A388D] text-white">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-10">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-6">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex h-20 w-20 md:h-20 md:w-20 items-center justify-center rounded-full bg-white flex-shrink-0 overflow-hidden p-2">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <svg className="h-7 w-7 md:h-8 md:w-8 mb-1.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Car with wings icon */}
                  <path d="M5 10 L8 6 L16 6 L19 10 L17 12 L12 9 L7 12 Z" fill="#3A388D" />
                  <circle cx="8" cy="13" r="1.5" fill="#3A388D" />
                  <circle cx="16" cy="13" r="1.5" fill="#3A388D" />
                  <path d="M3 8 L5 6 L7 8" stroke="#3A388D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M17 8 L19 6 L21 8" stroke="#3A388D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-[#FF8C00] font-bold text-xs md:text-sm">ST10</span>
                  <span className="text-[#FF8C00] font-bold text-[10px] md:text-xs">MAZAD</span>
                </div>
              </div>
            </div>
            <span className="font-medium text-white text-sm md:text-base">Street10 mazad</span>
          </div>

          {/* Center: Social platform message + Icons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <span className="text-white text-xs sm:text-sm md:text-base text-center sm:text-left">Join us social platform to stay updated</span>
            <div className="flex items-center gap-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0077B5] text-white transition-colors hover:bg-[#005885] focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0077B5] text-white transition-colors hover:bg-[#005885] focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Contact info */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <span className="text-white font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">Contact</span>
            <a href="mailto:contact-us@street10.com" className="flex items-center gap-1.5 text-white hover:underline text-xs sm:text-sm md:text-base whitespace-nowrap">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="break-all sm:break-normal">contact-us@street10.com</span>
            </a>
            <a href="tel:+20333333333" className="flex items-center gap-1.5 text-white hover:underline text-xs sm:text-sm md:text-base whitespace-nowrap">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+20 333 333 3333</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

