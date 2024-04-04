import { RiPencilLine } from "react-icons/ri";
import { Select, Option } from "@material-tailwind/react";
import { useState, useEffect } from "react";

const Forum = () => {
  const [post, setPost] = useState(false);
  const [cat,setCat] = useState()
  const [postDetails, setPostDetails] = useState({
    title: "",
    description: "",
    category: "",
  });

  const setInput = (event) => {
    const { name, value } = event.target;
    setPostDetails((prev) => ({ ...prev, [name]: value }));
  };

  console.log(postDetails);
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden lg:flex flex-col w-1/4 bg-white border-r border-gray-300">
        <div className="p-4">
          <h1 className="text-lg font-semibold mb-4">Filters</h1>
          <Select label="Select Version">
            <Option value="fiction">fiction</Option>
            <Option>Material Tailwind React</Option>
            <Option>Material Tailwind Vue</Option>
            <Option>Material Tailwind Angular</Option>
            <Option>Material Tailwind Svelte</Option>
          </Select>
          <h1 className="text-lg font-semibold mt-5">Trending</h1>
        </div>
      </div>

      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="bg-white border-b border-gray-300 py-4 px-4 lg:hidden">
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500">
            <option value="latest">Lastest</option>
            <option value="top">Top</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        <div className="fixed bottom-4 right-4 ">
          <div className="rounded-full bg-blue-500 p-2">
            <RiPencilLine
              onClick={() => setPost(true)}
              size={40}
              className="text-white cursor-pointer hover:text-black transition-colors duration-300"
            />
          </div>
        </div>
        {post === true && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-screen bg-black bg-opacity-50">
            <div className="bg-white p-8 border border-gray-300 rounded-lg w-3/4">
              <h2 className="text-lg font-semibold mb-4">NEW POST</h2>
              <input
                type="text"
                name="title"
                value={postDetails.title}
                onChange={setInput}
                placeholder="Title"
                className="w-full border border-gray-300 rounded p-2 mb-4"
              />
              <textarea
                name="description"
                value={postDetails.description}
                onChange={setInput}
                placeholder="What's on your mind?"
                rows="4"
                className="w-full border border-gray-300 rounded p-2 mb-4 resize-none"
              ></textarea>

              <Select
                name="category"
                label="Choose category"
                onChange={(selectedOption)=>setCat(selectedOption)}
              >
                <Option value="fiction">fiction</Option>
              </Select>

              <div className="flex justify-end mt-4">
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2">
                  POST
                </button>
                <button
                  onClick={() => setPost(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="bg-white shadow rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-200">
            <h2 className="text-lg font-semibold mb-2">Discussion Title</h2>
            <p className="text-gray-600 mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p className="text-sm text-gray-500">
              Posted by John Doe on April 4th, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
