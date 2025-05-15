const ACCTestimonials = () => {
  return (
    <section className="flex items-center bg-neutral-100 dark:bg-neutral-900 justify-center py-20  min-w-screen">
      <div className="px-16 ">
        <div className="container flex flex-col items-start mx-auto lg:items-center">
          <p className="relative flex items-start justify-start w-full text-lg font-bold tracking-wider text-purple-500 uppercase lg:justify-center lg:items-center">
            Don&apos;t just take our word for it
          </p>

          <h2 className="relative flex items-start justify-start w-full max-w-3xl text-5xl font-bold lg:justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="absolute right-0 hidden w-12 h-12 -mt-2 -mr-16 text-gray-200 lg:inline-block"
              viewBox="0 0 975.036 975.036"
            >
              <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
            </svg>
            See what others are saying
          </h2>
          <div className="block w-full h-0.5 max-w-lg mt-6 bg-purple-100 rounded-full"></div>

          <div className="items-center justify-center w-full mt-12 mb-4 lg:flex">
            <div className="flex flex-col items-start justify-start w-full h-auto mb-12 lg:w-1/3 lg:mb-0">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 mr-4 overflow-hidden  rounded-full">
                  <img
                    src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="@block-heini"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col items-start justify-center">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">
                    @block-heini
                  </h4>
                  <p className="text-gray-600">Engineer</p>
                </div>
              </div>
              <blockquote className="mt-8 text-lg text-gray-500">
                &quot;Thanks. I just needed something simple to track my
                spending. I&apos;d build something myself but I don&apos;t have
                the time, so this is perfect.&quot;
              </blockquote>
            </div>
            <div className="flex flex-col items-start justify-start w-full h-auto px-0 mx-0 mb-12 border-l border-r border-transparent lg:w-1/3 lg:mb-0 lg:px-8 lg:mx-8 lg:border-gray-200">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 mr-4 overflow-hidden rounded-full">
                  <img
                    src="https://i.ytimg.com/vi/acVd-h8xGzM/maxresdefault.jpg"
                    alt="Bob"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col items-start justify-center">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">
                    Bob
                  </h4>
                  <p className="text-gray-600">Unemployed</p>
                </div>
              </div>
              <blockquote className="mt-8 text-lg text-gray-500">
                &quot;I really need to get my spending in order. I didn&apos;t
                know where to start, but this is perfect.&quot;
              </blockquote>
            </div>
            <div className="flex flex-col items-start justify-start w-full h-auto lg:w-1/3">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 mr-4 overflow-hidden bg-gray-200 rounded-full">
                  <img
                    src="https://i1.sndcdn.com/avatars-cIrNwobVqRq3aPyO-95OwZQ-t240x240.jpg"
                    alt="James"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col items-start justify-center">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">
                    James
                  </h4>
                  <p className="text-gray-600">Creator of Stuff</p>
                </div>
              </div>
              <blockquote className="mt-8 text-lg text-gray-500">
                &quot;Nice! I like the simplicity of it. I don&apos;t need all
                the bells and whistles. Just a simple tool to track my spending
                and income.&quot;
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ACCTestimonials;
