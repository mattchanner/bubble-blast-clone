export enum BubbleType {
    Blue,
    Yellow,
    Green,
    Red
}

export function getSize(type: BubbleType) {
    switch (type) {
        case BubbleType.Blue: return 50;
        case BubbleType.Yellow: return 60;
        case BubbleType.Green: return 70;
        case BubbleType.Red: return 90;
    }
}

export function getCssName(type: BubbleType) {
    switch (type) {
        case BubbleType.Blue: return "body_grad_blue";
        case BubbleType.Yellow: return "body_grad_yellow";
        case BubbleType.Green: return "body_grad_green";
        case BubbleType.Red: return "body_grad_red";
    }
}

export function nextType(current: BubbleType) {
    switch (current) {
        case BubbleType.Blue: return BubbleType.Yellow;
        case BubbleType.Yellow: return BubbleType.Green;
        case BubbleType.Green: return BubbleType.Red;
        case BubbleType.Red: return BubbleType.Red;
    }
}