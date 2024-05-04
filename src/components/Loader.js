import { ClipLoader } from "react-spinners";

const Loader = ({loading}) => {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <ClipLoader color={"#123abc"} loading={loading} size={50} />
          </div>
        </div>
      );
    }

export default Loader;