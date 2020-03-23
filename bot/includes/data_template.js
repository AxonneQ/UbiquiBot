module.exports = {
    settings: () => {
        var new_settings = {
            options: {
                dark_jokes: 0
            },
            modules: [],
            data: {
                initial_count_done: false,
                total_messages: 0,
                last_message_id: 0,
                channels: []
            }


        };
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
        };
        return new_user;
    }
};