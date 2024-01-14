import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  0% {
    transform: rotate(1turn);
  }
`;

const rotateBefore = keyframes`
  0% {
    transform: rotate(-2turn);
  }
`;

const rotateAfter = keyframes`
  0% {
    transform: rotate(2turn);
  }
`;

type BubbleContainerProps = {
  size: number;
  speed: number;
  colors: string[];
};

const BubbleContainer = styled.div<BubbleContainerProps>`
  --size: ${(props) => props.size + 'rem'};
  --speed: ${(props) => props.speed + 's'}; /* Add this line with a default value */;
  width: var(--size);
  height: var(--size);
  background: hsl(0, 0%, 71%);
  border: calc(var(--size) * 0.09) solid hsl(0, 0%, 81%);
  position: absolute;
  top: calc(50% - (var(--size) * 0.49));
  left: calc(50% - (var(--size) * 0.49));
  overflow: visible;
  border-radius: 48% 40% 62% 47% / 61% 49% 64% 43%;
  animation: ${rotate} var(--speed) infinite linear; /* Reference --speed here */
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: calc(var(--size) * 0.1);
    left: calc(var(--size) * 0.1);
    width: calc(100% - (var(--size) * 0.3));
    height: calc(100% - (var(--size) * 0.3));
    background: hsl(0, 0%, 51%);
    border: calc(var(--size) * 0.065) solid hsl(0, 0%, 61%);
    border-radius: 41% 40% 50% 55% / 49% 52% 51% 43%;
    z-index: -2;
    animation: ${rotateBefore} var(--speed) infinite linear; /* Reference --speed here */
  }

  &:after {
    content: '';
    position: absolute;
    top: calc(var(--size) * 0.2);
    left: calc(var(--size) * 0.2);
    width: calc(100% - (var(--size) * 0.5));
    height: calc(100% - (var(--size) * 0.5));
    background: hsl(0, 0%, 31%);
    border: calc(var(--size) * 0.05) solid hsl(0, 0%, 41%);
    border-radius: 42% 63% 51% 60% / 47% 62% 42% 52%;
    animation: ${rotateAfter} var(--speed) infinite linear; /* Reference --speed here */
  }
`;

function Bubble({ size, speed, theme }: { size: number, speed: number, theme: string }) {
  const lightThemeColor = ['hsl(0, 0%, 71%)', 'hsl(0, 0%, 81%)', 'hsl(0, 0%, 51%)', 'hsl(0, 0%, 61%)', 'hsl(0, 0%, 31%)', 'hsl(0, 0%, 41%)'];
  const darkThemeColor = ['hsl(0, 0%, 29%)', 'hsl(0, 0%, 39%)', 'hsl(0, 0%, 9%)', 'hsl(0, 0%, 19%)', 'hsl(0, 0%, 9%)', 'hsl(0, 0%, 19%)'];

  const themeColor = theme === 'light' ? lightThemeColor : darkThemeColor;

  return <BubbleContainer size={size} speed={speed} colors={themeColor}></BubbleContainer>;
}

export default Bubble;