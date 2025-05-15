import Link from "next/link";

const ACCPricing = () => {
  return (
    <section className="box-border py-8 leading-7 text-gray-700 dark:text-gray-100 border-0 border-gray-200 border-solid sm:py-12 md:py-16 lg:py-24">
      <div className="box-border max-w-6xl px-4 pb-12 mx-auto border-solid sm:px-6 md:px-6 lg:px-4">
        <div className="flex flex-col items-center leading-7 text-center  text-gray-700 dark:text-gray-100">
          <h2 className="box-border m-0 text-3xl font-semibold leading-tight tracking-tight  text-gray-700 dark:text-gray-100 border-solid sm:text-4xl md:text-5xl">
            Pricing Options
          </h2>
          <p className="box-border mt-4 text-2xl leading-normal text-gray-700 dark:text-gray-300 border-solid">
            It&apos;s free
          </p>
        </div>
        <div className="grid max-w-md mx-auto mt-6 overflow-hidden leading-7 dark:text-gray-300 text-gray-700 border border-b-4 border-indigo-600 rounded-xl md:max-w-lg lg:max-w-none sm:mt-10 lg:grid-cols-3">
          <div className="box-border px-4 py-8 mb-6 text-center  border-solid lg:mb-0 sm:px-4 sm:py-8 md:px-8 md:py-12 lg:px-10">
            <h3 className="m-0 text-2xl font-semibold leading-tight tracking-tight  text-gray-700 dark:text-gray-100 border-0 border-solid sm:text-3xl md:text-4xl">
              300+ Currencies
            </h3>
            <p className="mt-3 leading-7 dark:text-gray-300 text-gray-700 border-0 border-solid">
              300+ currencies supported, including USD, EUR, BTC, ETH, and more.
            </p>
            <div className="flex items-center justify-center mt-6 leading-7 dark:text-gray-300 text-gray-700 border-0 border-solid sm:mt-8">
              <p className="box-border m-0 text-6xl font-semibold leading-normal text-center border-0 border-gray-200">
                free
              </p>
              <p className="box-border my-0 ml-4 mr-0 text-xs text-left border-0 border-gray-200">
                per user <span className="block">per month</span>
              </p>
            </div>
          </div>
          <div className="box-border px-4 py-8 mb-6 text-center border-r border-l border-solid lg:mb-0 sm:px-4 sm:py-8 md:px-8 md:py-12 lg:px-10">
            <h3 className="m-0 text-2xl font-semibold leading-tight tracking-tight dark:text-gray-300 text-gray-700 border-0 border-solid sm:text-3xl md:text-4xl">
              No Limits
            </h3>
            <p className="mt-3 leading-7 dark:text-gray-300 text-gray-700 border-0 border-solid">
              Track as much or as little as you want. No limits on transactions.
            </p>
            <div className="flex items-center justify-center mt-6 leading-7 dark:text-gray-300 text-gray-700 border-0 border-solid sm:mt-8">
              <p className="box-border m-0 text-6xl font-semibold leading-normal text-center border-0 border-gray-200">
                free
              </p>
              <p className="box-border my-0 ml-4 mr-0 text-xs text-left border-0 border-gray-200">
                per user <span className="block">per month</span>
              </p>
            </div>
          </div>
          <div className="box-border px-4 py-8 text-center  border-solid sm:px-4 sm:py-8 md:px-8 md:py-12 lg:px-10">
            <h3 className="m-0 text-2xl font-semibold leading-tight tracking-tight dark:text-gray-300 text-gray-700 border-0 border-solid sm:text-3xl md:text-4xl">
              Daily Updates
            </h3>
            <p className="mt-3 leading-7 dark:text-gray-300 text-gray-700 border-0 border-solid">
              Daily updates for crypto and fiat currency exchange rates.
            </p>
            <div className="flex items-center justify-center mt-6 leading-7 dark:text-gray-300 text-gray-700 border-0 border-solid sm:mt-8">
              <p className="box-border m-0 text-6xl font-semibold leading-normal text-center border-0 border-gray-200">
                free
              </p>
              <p className="box-border my-0 ml-4 mr-0 text-xs text-left border-0 border-gray-200">
                per user <span className="block">per month</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Link
        href="/signup"
        className="max-w-sm flex justify-center m-auto items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
      >
        Use it if you feel like it
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 ml-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </Link>
    </section>
  );
};

export default ACCPricing;
