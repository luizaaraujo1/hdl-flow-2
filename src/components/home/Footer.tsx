function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-gray-950 to-gray-800 py-6 text-gray-300">
      <div className="container mx-auto text-center">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} HDL Flow. All rights reserved.
        </p>
        <p className="text-sm">
          This project is licensed under the MIT License.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
