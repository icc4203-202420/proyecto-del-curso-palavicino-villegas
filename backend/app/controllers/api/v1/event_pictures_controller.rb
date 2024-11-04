class API::V1::EventPicturesController < ApplicationController
  def create
    @event_picture = EventPicture.new(event_picture_params)

    if @event_picture.save
      render json: { message: 'Picture uploaded successfully', event_picture: @event_picture }, status: :created
    else
      render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    @event_picture =  EventPicture.find(params[:id])
    if @event_picture
      render json: { event_picture: @event_picture }, status: :ok
    else
      render json: { error: "Event_picture not found" }, status: :not_found
    end
  end


  private

  def event_picture_params
    params.require(:event_picture).permit(:event_id, :user_id, :description, :picture, :tagged_friends)
  end
end
