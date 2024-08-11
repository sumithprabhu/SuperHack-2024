// pages/contact.js
import Head from 'next/head'

export default function Page() {
  return (
    <div className="bg-gray-800 min-h-screen flex justify-center items-center">
      <Head>
        <title>Contact Us - RaiseCoin</title>
      </Head>

      <div className="container p-8 max-w-lg">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">Contact Us</h1>
        <p className="text-gray-300 mb-8 text-center">
          Have any questions or want to get in touch? Fill out the form below.
        </p>

        <form className="w-full">
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="first-name">
              First Name
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="first-name" type="text" placeholder="Jane" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="last-name">
              Last Name
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="last-name" type="text" placeholder="Doe" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="email@example.com" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Enter your message" rows="4"></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
