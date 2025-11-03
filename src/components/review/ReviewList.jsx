import { FaStar } from 'react-icons/fa';
import { format } from 'date-fns';

const ReviewList = ({ reviews, loading }) => {
  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="font-semibold text-gray-900 mr-2">
                  {review.username}
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 mb-2">{review.comment}</p>
              )}
              <p className="text-sm text-gray-500">
                {format(new Date(review.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;