class GenerateVideoJob < ApplicationJob
  queue_as :default

  def perform(event)
    images_dir = Rails.root.join("public", "event_images", "event_#{event.id}")
    video_dir = Rails.root.join("public", "videos", "event_#{event.id}")
    video_path = video_dir.join("event_#{event.id}.mp4")

    FileUtils.mkdir_p(video_dir) unless Dir.exist?(video_dir)

    system("ffmpeg -framerate 1/3 -pattern_type glob -i '#{images_dir}/*.jpg' -c:v libx264 '#{video_path}'")
    event.video_url.attach(io: File.open(video_path), filename: "event_#{event.id}.mp4", content_type: "video/mp4")

    event.save!

    notify_participants(event)
  end

  def notify_participants(event)
    event.users.each do |user|
      notification_sent = false

      if user.expo_push_token.present?
        notification_sent = PushNotificationService.send_notification(
          to: user.expo_push_token,
          title: "¡Video del evento '#{event.name}'!",
          body: "Se ha generado un video del evento '#{event.name}'. ¡Toca para verlo!",
          data: { screen: "EventsShow", event_id: event.id }
        )

        if notification_sent
          Rails.logger.info("Notificación enviada con éxito a #{user.handle}")
        else
          Rails.logger.error("Error al enviar la notificación a #{user.handle}")
        end
      else
        Rails.logger.warn("El usuario #{user.handle} no tiene expo_push_token, no se envió notificación")
      end
    end
  end
end
