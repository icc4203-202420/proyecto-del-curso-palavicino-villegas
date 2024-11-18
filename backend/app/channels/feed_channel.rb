class FeedChannel < ApplicationCable::Channel
    def subscribed
      stream_from "feed_channel"
    end
  
    def unsubscribed
      # Cleanup if necessary
    end
  
    def speak(data)
      Rails.logger.info "Mensaje recibido: #{data.inspect}"
      message = data["message"]
  
      if message.present?
        ActionCable.server.broadcast("feed_channel", { message: message + " and backend" })
        Rails.logger.info "Mensaje transmitido: #{message}"
      else
        Rails.logger.error "No se recibió ningún mensaje válido"
      end
    end
  end