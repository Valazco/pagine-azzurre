export default function PostHeader() {
  return (
    <div className="bg-blue-50 border-y border-blue-200 py-3">
      <div className="container mx-auto px-4 text-center text-sm text-gray-700">
        Iscriviti qui:{' '}
        <a
          className="text-blue-600 hover:text-blue-800 font-semibold underline"
          href="https://valazco.it"
          target="_blank"
          rel="noopener noreferrer"
        >
          valazco.it
        </a>{' '}
        per avere i VAL contributo di emancipazione giornaliero da utilizzare subito
      </div>
    </div>
  );
}
