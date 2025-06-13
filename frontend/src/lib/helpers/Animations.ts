export default class Animations {
    public static shake(element: HTMLElement) {
        return element.animate(
            [
                { transform: 'translateX(0)' },
                { transform: 'translateX(-3px)' },
                { transform: 'translateX(3px)' },
                { transform: 'translateX(-3px)' },
                { transform: 'translateX(3px)' },
                { transform: 'translateX(0)' }
            ],
            {
                duration: 400,
                iterations: 1,
                easing: 'ease-in-out'
            }
        )
    }
} 