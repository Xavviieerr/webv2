/** Display view-model for a review row shown in the ratings panel. */
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  rating: number;
  comment: string;
  date: string;
  profilePictureUrl?: string;
}
