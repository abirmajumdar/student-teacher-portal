import { PhotoIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import BASE_URL from '../utils/utils.js'
import axios from 'axios'
import { ToastContainer,toast,Bounce } from 'react-toastify'


function UploadModal(props) {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [isShowModel,setShowModel] = useState()

  const submitHandler = async (e) => {
    console.log(BASE_URL)
    console.log(image.name)
    e.preventDefault()
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image); // ⬅️ real file
    formData.append("email", "rupali02@gmail.com");
    const res = await axios.post(`${BASE_URL}/batch/create-batch`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (res.status == 201) {
      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        onClose: () => {
          props.closeModal()
        }
        
      });
    }
    else {
        toast.error("incorrect otp", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
            });

    }
  }
  return (
    <form className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl " id='create-batch-form'>
      <div className="space-y-8">
        {/* Title & Description */}
        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Batch Title *
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter batch name"
                value={title}
                onChange={(e) => { setTitle(e.target.value) }}
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700">
              Batch Description *
            </label>
            <div className="mt-2">
              <textarea
                id="about"
                name="about"
                rows={4}
                placeholder="Write a few sentences about your batch"
                value={description}
                onChange={(e) => { setDescription(e.target.value) }}
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-base text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">Write a few sentences about your batch</p>
          </div>
        </div>

        {/* Upload */}
        <div>
          <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700">
            Cover Photo
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 bg-gray-50">
            <div className="text-center">
              <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setImage(e.target.files[0])} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition" onClick={props.closeModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={submitHandler}
          >
            Save
          </button>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
        </div>
      </div>
    </form>
  )
}

export default UploadModal
