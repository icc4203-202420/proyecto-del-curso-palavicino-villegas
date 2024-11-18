class API::V1::ReviewsController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:index, :create], if: -> { params[:user_id].present? }
  before_action :set_review, only: [:show, :update, :destroy]
  before_action :set_beer, only: [:index], if: -> { params[:beer_id].present? }


  def feed_reviews

  end

  def index
    if @user
      @reviews = Review.where(user: @user)
    elsif @beer
      @reviews = Review.where(beer: @beer)
    else
      @reviews = Review.all
    end

    render json: {
      reviews: @reviews.as_json(include: {
        user: { only: [:handle, :email] }
      })
    }, status: :ok
  end


  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    @review = @user.reviews.build(review_params)
    if @review.save
      ActionCable.server.broadcast "feed_channel", {
        message: "Nuevo review creado",
        review: {
          text: @review.text,
          rating: @review.rating,
          created_at: @review.created_at,
          updated_at: @review.updated_at,
          user: @review.user.as_json(only: [:first_name, :last_name, :handle]),
          beer: @review.beer.as_json(only: [:name, :style, :alcohol])
        }
      }
      render json: @review, status: :created, location: api_v1_review_url(@review)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  def set_user
    @user = User.find(params[:user_id])
  end

  def set_beer
    @beer = Beer.find_by(id: params[:beer_id])
    render json: { error: "Beer not found" }, status: :not_found unless @beer
  end

  def review_params
    params.require(:review).permit(:id, :text, :rating, :beer_id)
  end
end
