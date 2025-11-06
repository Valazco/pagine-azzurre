import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <div className="h-8 bg-white" />
      <footer className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-700">
          Un progetto fatto con{' '}
          <span className="text-red-500" role="img" aria-label="a heart">
            ❤️
          </span>{' '}
          dal team{' '}
          <a
            href="https://valazco.it"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            valazco.it
          </a>
        </div>
      </footer>
    </>
  );
}
