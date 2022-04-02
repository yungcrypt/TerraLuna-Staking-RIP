import { horizontalRuler } from '@libs/styled-neumorphism';
import styled from 'styled-components';

/**
 * Styled `<hr/>` tag
 */
export const HorizontalRuler = styled.hr`
  ${({ theme }) =>
    horizontalRuler({
      color: 'rgba(255,255,255, 0.5)',
      intensity: theme.intensity,
    })};
`;
