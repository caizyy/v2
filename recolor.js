module.exports.colortext = function(message, color) {
    txtcolors = {
            "black": "30",
            "red": "31",
            "green": "32",
            "yellow": "33",
            "blue": "34",
            "magenta": "35",
            "cyan": "36",
            "white": "37",
            "gray": "90",
            "brightred": "91",
            "brightgreen": "92",
            "brightyellow": "93",
            "brightblue": "94",
            "brightmagenta": "95",
            "brightcyan": "96",
            "brightwhite": "97"
        };

        return(`\x1b[${txtcolors[color]}m${message}\x1b[0m`);//send colored message with default bg color >w<
};