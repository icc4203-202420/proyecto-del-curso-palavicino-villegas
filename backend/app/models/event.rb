class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances

  has_one_attached :flyer

  # Creo que ya no es necesario (o quizá sí para acceder al video desde el front)
  has_one_attached :video_url

  has_many :event_pictures, dependent: :destroy

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end
end
