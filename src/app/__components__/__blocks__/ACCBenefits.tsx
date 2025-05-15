import { GiMoneyStack } from "react-icons/gi";
import { FaBitcoin } from "react-icons/fa";

const ACCBenefits = () => {
  return (
    <section className="w-full pt-7 pb-7 md:pt-20 md:pb-24">
      <div className="box-border flex flex-col items-center content-center px-8 mx-auto leading-6 text-black border-0 border-gray-300 border-solid md:flex-row max-w-7xl lg:px-16">
        <div className="flex justify-center md:justify-end box-border relative w-full max-w-md px-4 mt-5 mb-4 -ml-5 text-center bg-no-repeat bg-contain border-solid md:ml-0 md:mt-0 md:max-w-none lg:mb-0 md:w-1/2 xl:pl-10">
          <GiMoneyStack
            size={256}
            className="text-gray-200 dark:text-gray-800 px-6"
          />
        </div>

        <div className="box-border order-first w-full text-gray-900 dark:text-gray-100 border-solid md:w-1/2 md:pl-10 md:order-none">
          <h2 className="m-0 text-xl font-semibold leading-tight border-0 border-gray-300 lg:text-3xl md:text-2xl">
            Reduce Spending
          </h2>
          <p className="pt-4 pb-8 m-0 leading-7 text-gray-600 border-0 border-gray-300 sm:pr-12 xl:pr-32 lg:text-lg">
            Keep track of your expenses and income and stay on top of your
            finances.
          </p>
          <ul className="p-0 m-0 leading-6 border-0 border-gray-300">
            <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
              <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-green-500 rounded-full">
                <span className="text-sm font-bold">✓</span>
              </span>{" "}
              Track of your spending
            </li>
            <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
              <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-green-500 rounded-full">
                <span className="text-sm font-bold">✓</span>
              </span>{" "}
              See where your money is going
            </li>
            <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
              <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-green-500 rounded-full">
                <span className="text-sm font-bold">✓</span>
              </span>{" "}
              See who owes you money
            </li>
          </ul>
        </div>
      </div>
      <div className="box-border flex flex-col items-center content-center px-8 mx-auto mt-2 leading-6 text-gray-900 dark:text-gray-100 border-0 border-gray-300 border-solid md:mt-20 xl:mt-0 md:flex-row max-w-7xl lg:px-16">
        <div className="box-border w-full text-gray-900 dark:text-gray-100 border-solid md:w-1/2 md:pl-6 xl:pl-32">
          <h2 className="m-0 text-xl font-semibold leading-tight border-0 border-gray-300 lg:text-3xl md:text-2xl">
            Track Crypto & Fiat
          </h2>
          <p className="pt-4 pb-8 m-0 leading-7 text-gray-600 border-0 border-gray-300 sm:pr-10 lg:text-lg">
            Track your crypto and fiat currencies in one place.{" "}
          </p>
          <ul className="p-0 m-0 leading-6 border-0 border-gray-300">
            <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
              <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-green-500 rounded-full">
                <span className="text-sm font-bold">✓</span>
              </span>{" "}
              Daily crypto exchange rate updates
            </li>
            <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
              <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-green-500 rounded-full">
                <span className="text-sm font-bold">✓</span>
              </span>{" "}
              Daily forex exchange rate updates
            </li>
            <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
              <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-green-500 rounded-full">
                <span className="text-sm font-bold">✓</span>
              </span>{" "}
              Support for over 300+ currencies
            </li>
          </ul>
        </div>

        <div className="flex justify-center md:justify-start box-border relative w-full max-w-md px-4 mt-10 mb-4 text-center bg-no-repeat bg-contain border-solid md:mt-0 md:max-w-none lg:mb-0 md:w-1/2">
          <FaBitcoin
            size={256}
            className="text-gray-200 dark:text-gray-800 px-6"
          />
        </div>
      </div>
    </section>
  );
};

export default ACCBenefits;
