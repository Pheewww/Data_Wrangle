

const HomeScreen = () => {
  return (
    <div className="flex flex-col mr-40 mt-32 items-center  min-h-screen bg-white ">
      <div>
        <h1 className="text-5xl ">
          Welcome to <span className="text-blue-600 font-semibold">DataLoom</span>,
        </h1>
        <h1 className="text-4xl mt-2">
          your one-stop for{" "}
          <span className="text-green-600 font-semibold">
            Dataset Transformations
          </span>
          .
        </h1>
      </div>
      <div className="mt-20 mr-32 grid grid-cols-2 gap-10 justify-start w-2/5 font-sans font-semibold">
        <button className="px-2 py-4 bg-gradient-to-r from-green-400 hover:bg-blue-600 rounded-lg shadow-lg">
          New Project
        </button>
        <button className="px-2 py-4 bg-gradient-to-r from-green-400 hover:bg-blue-600 rounded-lg shadow-lg">
          Last Project 1
        </button>
        <button className="px-2 py-4 bg-gradient-to-r from-green-400 hover:bg-blue-600 rounded-lg shadow-lg">
          Last Project 2
        </button>
        <button className="px-2 py-4 bg-gradient-to-r from-green-400 hover:bg-blue-600 rounded-lg shadow-lg">
          Last Project 3
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
