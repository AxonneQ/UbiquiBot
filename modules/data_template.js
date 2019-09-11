module.exports = {
        settings: () => {
                var new_settings = {
                        dark_jokes: 0
                }
                return new_settings;
        },

        user: (user) => {
                var new_user = {
                        user_id: user.id,
                        username: user.username,
                        level: 0,
                        experience_points: 0,
                        message_count: 0,
                        joined_discord: user.joined_discord,
                        joined_server: user.joined_server
                }
                return new_user;
        }
}