# app/channels/feed_channel.rb
class FeedChannel < ApplicationCable::Channel
  def subscribed
    stream_from "feed_channel" 
  end

  def unsubscribed
  
  end
end
