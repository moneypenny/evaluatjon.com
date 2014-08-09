class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :replies

  validates :email, presence: true, uniqueness: true

  validates :password, presence: true, length: {minimum: 5, maximum: 120},
                       on: :create, confirmation: true

  # See http://stackoverflow.com/questions/16811530/devise-3-rails-4-cant-update-user-without-password
  validates :password, length: {minimum: 5, maximum: 120}, on: :update,
                       allow_blank: true, confirmation: true

  before_save :ensure_auth_token

  def ensure_auth_token
    self.auth_token ||= generate_auth_token
  end

  def reset_auth_token
    self.auth_token = generate_auth_token
    save
  end

  private

  def generate_auth_token
    loop do
      token = Devise.friendly_token
      break token unless User.where(auth_token: token).first
    end
  end
end
