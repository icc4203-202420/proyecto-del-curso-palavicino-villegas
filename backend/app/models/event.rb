class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances

  has_one_attached :flyer

  # Creo que ya no es necesario (o quizá sí para acceder al video desde el front)
  has_one_attached :video_url

  has_many :event_pictures, dependent: :destroy

  def video_url_path
    video_url.attached? ? Rails.application.routes.url_helpers.rails_blob_url(video_url, only_path: true) : nil
  end

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end
end
