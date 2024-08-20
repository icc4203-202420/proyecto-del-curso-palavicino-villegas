class API::V1::FriendshipsController < ApplicationController
  # Revisar routes.rb

  before_action :authenticate_user!
  before_action :set_user

  # GET /api/v1/users/:user_id/friendships
  def index
    @friends = User.joins(:friendships).where(friendships: { user_id: @user.id })
    render json: { friends: @friends }, status: :ok
  end


  # POST /api/v1/users/:user_id/friendships
  def create
    friend = User.find_by(id: friendship_params[:friend_id])

    # Si no existe el amigo
    if friend.nil?
      render json: { error: "Friend not found" }, status: :not_found
      return
    end


    # Si ya son amigos
    if @user.friendships.exists?(friend: friend)
      render json: { error: "Already friends" }, status: :unprocessable_entity
      return
    end

    # Si es una nueva amistad
    @friendship = @user.friendships.build(friend: friend)

    if @friendship.save
      render json: @friendship, status: :created, location: api_v1_user_friendship_url(@user, @friendship)
    else
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def friendship_params
    params.require(:friendship).permit(:friend_id)
  end
end
