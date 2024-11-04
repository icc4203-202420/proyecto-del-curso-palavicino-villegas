class GenerateVideoJob < ApplicationJob
  queue_as :default

  def perform(event)
    images_dir = Rails.root.join("public", "event_images", "event_#{event.id}")
    video_dir = Rails.root.join("public", "videos", "event_#{event.id}")
    video_path = video_dir.join("event_#{event.id}.mp4")

    FileUtils.mkdir_p(video_dir) unless Dir.exist?(video_dir)

    system("ffmpeg -framerate 1/3 -pattern_type glob -i '#{images_dir}/*.jpg' -c:v libx264 '#{video_path}'")
    event.video_url.attach(io: File.open(video_path), filename: "event_#{event.id}.mp4", content_type: "video/mp4")
  end
end
