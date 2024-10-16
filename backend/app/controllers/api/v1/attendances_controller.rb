class API::V1::AttendancesController < ApplicationController
  def create
    attendance = Attendance.new(attendance_params)
    if attendance.save
      render json: { status: 'success', attendance: attendance }, status: :created
    else
      render json: { status: 'error', errors: attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def attendance_params
    params.require(:attendance).permit(:user_id, :event_id)
  end
end
