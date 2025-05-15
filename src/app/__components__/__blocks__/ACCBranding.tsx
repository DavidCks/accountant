const ACCBranding = () => {
  return (
    <section className="px-2 py-2 md:px-0">
      <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
        <div className="flex flex-wrap items-center sm:-mx-3">
          <div className="w-full md:w-1/2 md:px-3 pb-16">
            <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
              <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                <span className="block ">Simple Budgeting</span>
                <span className="block text-indigo-600">
                  For Everyday People
                </span>
              </h2>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-full h-auto flex flex-col justify-center items-center overflow-hidden rounded-md shadow-xl sm:rounded-xl">
              <img
                className="dark:invert mx-2"
                width={164}
                height={164}
                src="https://sandai.org/favicon.ico"
                alt="sandai logo"
              />
              <img
                className="dark:invert"
                src="/accountant-logo.png"
                alt="accountant logo"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ACCBranding;
