export function Footer() {
  return (
    <footer className="py-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-row items-center justify-center space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            PrelimsPrep © {new Date().getFullYear()}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Version 0.1.10
          </p>
        </div>
        <a
          href="https://www.buymeacoffee.com/prelimsprep"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-90 transition-opacity ml-auto"
        >
          <img
            src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=prelimsprep&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
            alt="Buy Me A Coffee"
            className="h-10"
          />
        </a>
      </div>
    </footer>
  );
}
