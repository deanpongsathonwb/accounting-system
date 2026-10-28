import React from 'react';

export interface SemanticTextProps {
  text?: string | React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export interface SemanticPhrase {
  phrase: string;
  hasSpaceAfter: boolean;
}

/**
 * Splits Thai / multilingual text into semantic phrases wrapped with `inline-block`
 * so line wrapping on portrait or narrow screens breaks naturally at appropriate
 * phrase boundaries, such as before conjunctions like "และ" (and) or "หรือ" (or),
 * without breaking words mid-syllable.
 */
export function splitSemanticPhrases(text: string): SemanticPhrase[] {
  if (!text) return [];

  // Match parenthetical or bracketed suffix (e.g. " (Accounts Receivable)")
  const parenMatch = text.match(/\s*(\([^)]+\)|\[[^\]]+\])$/);
  let mainText = text;
  let parenSuffix = '';
  if (parenMatch && parenMatch.index !== undefined) {
    mainText = text.slice(0, parenMatch.index);
    parenSuffix = parenMatch[0].trim();
  }

  // Split by whitespace
  const rawSegments = mainText.split(' ').filter(Boolean);
  const results: SemanticPhrase[] = [];

  for (let i = 0; i < rawSegments.length; i++) {
    const seg = rawSegments[i];
    const subPhrases: string[] = [];
    let current = seg;

    while (current.length > 0) {
      // Look for conjunctions ("และ" or "หรือ") not at start of current slice
      let conjIdx = -1;
      const andIdx = current.indexOf('และ');
      const orIdx = current.indexOf('หรือ');

      if (andIdx > 0 && (orIdx <= 0 || andIdx < orIdx)) {
        conjIdx = andIdx;
      } else if (orIdx > 0 && (andIdx <= 0 || orIdx < andIdx)) {
        conjIdx = orIdx;
      }

      if (conjIdx > 0) {
        subPhrases.push(current.slice(0, conjIdx));
        current = current.slice(conjIdx);
      } else {
        subPhrases.push(current);
        break;
      }
    }

    subPhrases.forEach((phrase, pIdx) => {
      const isLastInSeg = pIdx === subPhrases.length - 1;
      const isLastOverall = i === rawSegments.length - 1 && !parenSuffix;
      results.push({
        phrase,
        hasSpaceAfter: isLastInSeg && !isLastOverall
      });
    });
  }

  if (parenSuffix) {
    results.push({ phrase: parenSuffix, hasSpaceAfter: false });
  }

  return results;
}

/**
 * Renders text with semantic phrases wrapped in `inline-block` spans.
 */
export function renderSemanticText(text: string | React.ReactNode): React.ReactNode {
  if (typeof text !== 'string') {
    return text;
  }

  const phrases = splitSemanticPhrases(text);
  if (phrases.length <= 1) {
    return text;
  }

  return (
    <>
      {phrases.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className="inline-block">{item.phrase}</span>
          {item.hasSpaceAfter ? ' ' : ''}
        </React.Fragment>
      ))}
    </>
  );
}

export const SemanticText: React.FC<SemanticTextProps> = ({
  text,
  className = '',
  as: Component = 'span'
}) => {
  if (!text) return null;

  return (
    <Component className={className}>
      {renderSemanticText(text)}
    </Component>
  );
};
