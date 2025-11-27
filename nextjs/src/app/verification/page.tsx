import MessageBox from '@/components/ui/MessageBox';
import Link from 'next/link';

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📧</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Verifica la tua Email
        </h1>

        <MessageBox variant="info">
          Ti abbiamo inviato una email di conferma.
          Controlla la tua casella di posta e clicca sul link per attivare il tuo account.
        </MessageBox>

        <p className="text-gray-600 mt-6 text-sm">
          Non hai ricevuto l&apos;email? Controlla la cartella spam o{' '}
          <Link href="/signin" className="text-blue-600 hover:underline">
            torna al login
          </Link>
        </p>
      </div>
    </div>
  );
}
