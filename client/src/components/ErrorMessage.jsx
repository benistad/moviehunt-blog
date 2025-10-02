import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-red-900 font-semibold mb-1">Une erreur est survenue</h3>
            <p className="text-red-700 text-sm">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 btn-primary text-sm"
              >
                Réessayer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
