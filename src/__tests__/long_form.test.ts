import { EMPTY, NEWLINE } from '../global_strings';
import { StringFormatter } from '../string_formatter';


/* eslint-disable */
const TEXT = 
`---
date: 2023-03-14
author: patriacaelum
---
# Calculus Made Easy: Being A Very-Simplest Introduction To Those Beautiful Methods of Reckoning Which Are Generally Called By The Terrifying Names of The Differential Calculus and the Integral Calculus
by F.R.S.
## Chapter I: To Deliver You From The Preliminary Terrors
The preliminary terror, which chokes off most fifth-form boys from even attempting to learn how to calculate, can be abolished once for all by simply stating what is the meaning -- in common-sense terms -- of the two principal symbols that are used in calculating.

These dreadful symbols are:

1. $d$ which merely means a "a little bit of."
   Thus $dx$ means a little bit of $x$; or $du$ means a little bit of $u$. Ordinary mathematicians think it more polite to say "an element of," instead of "a little bit of." Just as you please. But you will find that these little bits (or elements) may be considered to be indefinitely small.
2. $\\int$ which is merely a long *S*, and may be called (if you like) "the sum of."

Thus $\\int dx$ means the sum of all the little bits of $x$; or $\\int dt$ means the sum of all the little bits of $t$. Ordinary mathematicians call this symbol "the integral of." Now any fool can see that if $x$ is considered as made up of a lot of little bits, each of which is called $dx$, if you add them all up together you get the sum of all the $dx$'s, (which is the smae thing as the whole of $x$). The word "integral" simply means "the whole." If you think of the duration of time for one hour, you may (if you like) think of it as cut up into 3600 little bits called seconds. The whole of he 3600 little bits added up together make one hour.

When you see an expression that begins with this terrifying symbol, you will henceforth know that it is put there merely to give you instructions that you are now to perform the operation (if you can) of totalling up all the little bits that are indicated by the symbols that follow.

That's all.
## Chapter VII: Successive Differentiation
Let us try the effect of repeating several times over the operation of differentiating a function. Begin with a concrete case.

Let $y = x^5$.

- First differentiation, $5x^4$.
- Second differentiation, $5 \\times 4x^3 = 20x^3$.
- Third differentiation, $5 \\times 4 \\times 3x^2 = 60x^2$.
- Fourth differentiation, $5 \\times 4 \\times 3 \\times 2x = 120x$.
- Fifth differentiation, $5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.
- Sixth differentiation, $=0$.

There is a certain notation, with which we are already acquainted, used by some writers, that is very convenient. This is to employ the symbol $f(x)$ for any function of x. Here the symbol $f()$ is read as "function of," without saying what particular function is meant. So the statement, $y = f(x)$ merely tells us that $y$ is a function of $x$, it may be $x^2$ or $ax^n$, or $\\cos{x}$ or any other complicated function of $x$.

The corresponding symbol for the differential coefficient is $f'(x)$, which is simpler to write that $\\frac{dy}{dx}$. this is called the "derived function" of $x$.

Suppose we differentiate over gain, we shall get the "second derived function" of second differential coefficient, which is denoted by $f''(x)$; and so on.

Now let us generalize.

Let $y = f(x) = x^n$.

- First differentiation, $f'(x) = nx^{n-1}$.
- Second differentiation, $f''(x) = n(n - 1) x^{n-2}$.
- Third differentiation, $f'''(x) = n(n - 1)(n - 2) x^{n-3}$.
- Fourth differentation, $f''''(x) = n(n - 1)(n - 2)(n - 3) x^{n-4}$.

But this is not the only way of indicating successive differentations. For, if the original function be $y = f(x)$; once differentiating gives $$\\frac{dy}{dx} = f'(x)$$; twice differentiating gives $$\\frac{d\\(\\frac{dy}{dx}\)}{dx} = f''(x)$$; and this is more conveniently written as $\\frac{d^2y}{dx^2}$. Similarly, we may write as the result of thrice differentiating, $\\frac{d^y}{dx^3}$.

Now let us try $y = f(x) = 7x^4 + 3.5x^3 + \\frac{1}{2}x^2 + x - 2$.
$$\\begin{aligned} \\frac{dy}{dx} &= f'(x) = 28x^3 + 10.5x^2 - x + 1 \\\\ \\frac{d^2}{dx^2} &= f''(x) = 84x^2 + 21x - 1 \\\\ \\frac{d^3y}{dx^3} &= f'''(x) = 168x + 21 \\\\ \\frac{d^4y}{dx^4} &= f''''(x) = 168 \\\\ \\frac{d^5y}{dx^5} &= f'''''(x) = 0 \\end{aligned}$$

In a similar manner if $y = \\phi(x) = 3x(x^2 - 4)$,
$$\\begin{aligned} \\phi'(x) &= \\frac{dy}{dx} = 3 \(x \\times 2x + (x^2 - 4) \\times 1\) = 3(3x^2 - 4) \\\\ \\phi''(x) = \\frac{d^2y}{dx^2} = 3 \\times 6x = 18x \\\\ \\phi'''(x) &= \\frac{d^3y}{dx^3} = 18 \\\\ \\phi''''(x) &= \\frac{d^4y}{dx^4} = 0 \\end{aligned}$$
## Exercises IV
Find $\\frac{dy}{dx}$ and $\\frac{d^2y}{dx^2} for the following expressions:

1. $$y = 17x + 12x^2$$
2. $$y = \\frac{x^2 + a}{x + a}$$
3. $$y = 1 + \\frac{x}{1} + \\frac{x^2}{1 \\times 2} + \\frac{x^3}{1 \\times 2 \\times 3} + \\frac{x^4}{1 \\times 2 \\times 3 \\times 4}$$
`;
/* esline-enable */


test('long form text', () => {
	const formatted: string[] = new StringFormatter(TEXT).format().split(NEWLINE);

	expect(formatted[0]).toBe('---');
	expect(formatted[1]).toBe('date: 2023-03-14');
	expect(formatted[2]).toBe('author: patriacaelum');
	expect(formatted[3]).toBe('---');
	expect(formatted[4]).toBe(EMPTY);
	expect(formatted[5]).toBe('# Calculus Made Easy: Being A Very-Simplest Introduction To Those Beautiful Methods of Reckoning Which Are Generally Called By The Terrifying Names of The Differential Calculus and the Integral Calculus');
	expect(formatted[6]).toBe(EMPTY);
	expect(formatted[7]).toBe('by F.R.S.')
	expect(formatted[8]).toBe(EMPTY);
	expect(formatted[9]).toBe('## Chapter I: To Deliver You From The Preliminary Terrors');
	expect(formatted[10]).toBe(EMPTY);
	expect(formatted[11]).toBe('The preliminary terror, which chokes off most fifth-form boys from even');
	expect(formatted[12]).toBe('attempting to learn how to calculate, can be abolished once for all by simply');
	expect(formatted[13]).toBe('stating what is the meaning -- in common-sense terms -- of the two principal');
	expect(formatted[14]).toBe('symbols that are used in calculating.');
	expect(formatted[15]).toBe(EMPTY);
	expect(formatted[16]).toBe('These dreadful symbols are:');
	expect(formatted[17]).toBe(EMPTY);
	expect(formatted[18]).toBe('1. $d$ which merely means a "a little bit of."');
	expect(formatted[19]).toBe('   Thus $dx$ means a little bit of $x$; or $du$ means a little bit of $u$.');
	expect(formatted[20]).toBe('   Ordinary mathematicians think it more polite to say "an element of," instead');
	expect(formatted[21]).toBe('   of "a little bit of." Just as you please. But you will find that these little');
	expect(formatted[22]).toBe('   bits (or elements) may be considered to be indefinitely small.');
	expect(formatted[23]).toBe('2. $\\int$ which is merely a long *S*, and may be called (if you like) "the sum');
	expect(formatted[24]).toBe('   of."');
	expect(formatted[25]).toBe(EMPTY);
	expect(formatted[26]).toBe('Thus $\\int dx$ means the sum of all the little bits of $x$; or $\\int dt$ means');
	expect(formatted[27]).toBe('the sum of all the little bits of $t$. Ordinary mathematicians call this symbol');
	expect(formatted[28]).toBe('"the integral of." Now any fool can see that if $x$ is considered as made up of');
	expect(formatted[29]).toBe('a lot of little bits, each of which is called $dx$, if you add them all up');
	expect(formatted[30]).toBe(`together you get the sum of all the $dx$'s, (which is the smae thing as the`);
	expect(formatted[31]).toBe('whole of $x$). The word "integral" simply means "the whole." If you think of the');
	expect(formatted[32]).toBe('duration of time for one hour, you may (if you like) think of it as cut up into');
	expect(formatted[33]).toBe('3600 little bits called seconds. The whole of he 3600 little bits added up');
	expect(formatted[34]).toBe('together make one hour.');
	expect(formatted[35]).toBe(EMPTY);
	expect(formatted[36]).toBe('When you see an expression that begins with this terrifying symbol, you will');
	expect(formatted[37]).toBe('henceforth know that it is put there merely to give you instructions that you');
	expect(formatted[38]).toBe('are now to perform the operation (if you can) of totalling up all the little');
	expect(formatted[39]).toBe('bits that are indicated by the symbols that follow.');
	expect(formatted[40]).toBe(EMPTY);
	expect(formatted[41]).toBe(`That's all.`);
	expect(formatted[42]).toBe(EMPTY);
	expect(formatted[43]).toBe('## Chapter VII: Successive Differentiation');
	expect(formatted[44]).toBe(EMPTY);
	expect(formatted[45]).toBe('Let us try the effect of repeating several times over the operation of');
	expect(formatted[46]).toBe('differentiating a function. Begin with a concrete case.');
	expect(formatted[47]).toBe(EMPTY);
	expect(formatted[48]).toBe('Let $y = x^5$.');
	expect(formatted[49]).toBe(EMPTY);
	expect(formatted[50]).toBe('- First differentiation, $5x^4$.');
	expect(formatted[51]).toBe('- Second differentiation, $5 \\times 4x^3 = 20x^3$.');
	expect(formatted[52]).toBe('- Third differentiation, $5 \\times 4 \\times 3x^2 = 60x^2$.');
	expect(formatted[53]).toBe('- Fourth differentiation, $5 \\times 4 \\times 3 \\times 2x = 120x$.');
	expect(formatted[54]).toBe('- Fifth differentiation, $5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.');
	expect(formatted[55]).toBe('- Sixth differentiation, $=0$.');
	expect(formatted[56]).toBe(EMPTY);
	expect(formatted[57]).toBe('There is a certain notation, with which we are already acquainted, used by some');
	expect(formatted[58]).toBe('writers, that is very convenient. This is to employ the symbol $f(x)$ for any');
	expect(formatted[59]).toBe('function of x. Here the symbol $f()$ is read as "function of," without saying');
	expect(formatted[60]).toBe('what particular function is meant. So the statement, $y = f(x)$ merely tells us');
	expect(formatted[61]).toBe('that $y$ is a function of $x$, it may be $x^2$ or $ax^n$, or $\\cos{x}$ or any');
	expect(formatted[62]).toBe('other complicated function of $x$.');
	expect(formatted[63]).toBe(EMPTY);
	expect(formatted[64]).toBe(`The corresponding symbol for the differential coefficient is $f'(x)$, which is`);
	expect(formatted[65]).toBe('simpler to write that $\\frac{dy}{dx}$. this is called the "derived function" of');
	expect(formatted[66]).toBe('$x$.');
	expect(formatted[67]).toBe(EMPTY);
	expect(formatted[68]).toBe('Suppose we differentiate over gain, we shall get the "second derived function"');
	expect(formatted[69]).toBe(`of second differential coefficient, which is denoted by $f''(x)$; and so on.`);
	expect(formatted[70]).toBe(EMPTY);
	expect(formatted[71]).toBe('Now let us generalize.');
	expect(formatted[72]).toBe(EMPTY);
	expect(formatted[73]).toBe('Let $y = f(x) = x^n$.');
	expect(formatted[74]).toBe(EMPTY);
	expect(formatted[75]).toBe(`- First differentiation, $f'(x) = nx^{n-1}$.`);
	expect(formatted[76]).toBe(`- Second differentiation, $f''(x) = n(n - 1) x^{n-2}$.`);
	expect(formatted[77]).toBe(`- Third differentiation, $f'''(x) = n(n - 1)(n - 2) x^{n-3}$.`);
	expect(formatted[78]).toBe(`- Fourth differentation, $f''''(x) = n(n - 1)(n - 2)(n - 3) x^{n-4}$.`);
	expect(formatted[79]).toBe(EMPTY);
	expect(formatted[80]).toBe('But this is not the only way of indicating successive differentations. For, if');
	expect(formatted[81]).toBe('the original function be $y = f(x)$; once differentiating gives');
	expect(formatted[82]).toBe(`$$\\frac{dy}{dx} = f'(x)$$`);
	expect(formatted[83]).toBe('; twice differentiating gives');
	expect(formatted[84]).toBe(`$$\\frac{d\\(\\frac{dy}{dx}\)}{dx} = f''(x)$$`);
	expect(formatted[85]).toBe('; and this is more conveniently written as $\\frac{d^2y}{dx^2}$. Similarly, we');
	expect(formatted[86]).toBe('may write as the result of thrice differentiating, $\\frac{d^y}{dx^3}$.');
	expect(formatted[87]).toBe(EMPTY);
	expect(formatted[88]).toBe(`Now let us try $y = f(x) = 7x^4 + 3.5x^3 + \\frac{1}{2}x^2 + x - 2$.`);
	expect(formatted[89]).toBe(`$$\\begin{aligned} \\frac{dy}{dx} &= f'(x) = 28x^3 + 10.5x^2 - x + 1 \\\\ \\frac{d^2}{dx^2} &= f''(x) = 84x^2 + 21x - 1 \\\\ \\frac{d^3y}{dx^3} &= f'''(x) = 168x + 21 \\\\ \\frac{d^4y}{dx^4} &= f''''(x) = 168 \\\\ \\frac{d^5y}{dx^5} &= f'''''(x) = 0 \\end{aligned}$$`);
	expect(formatted[90]).toBe(EMPTY);
	expect(formatted[91]).toBe(EMPTY);
	expect(formatted[92]).toBe(`In a similar manner if $y = \\phi(x) = 3x(x^2 - 4)$,`);
	expect(formatted[93]).toBe(`$$\\begin{aligned} \\phi'(x) &= \\frac{dy}{dx} = 3 \(x \\times 2x + (x^2 - 4) \\times 1\) = 3(3x^2 - 4) \\\\ \\phi''(x) = \\frac{d^2y}{dx^2} = 3 \\times 6x = 18x \\\\ \\phi'''(x) &= \\frac{d^3y}{dx^3} = 18 \\\\ \\phi''''(x) &= \\frac{d^4y}{dx^4} = 0 \\end{aligned}$$`);
	expect(formatted[94]).toBe(EMPTY);
	expect(formatted[95]).toBe('## Exercises IV');
	expect(formatted[96]).toBe(EMPTY);
	expect(formatted[97]).toBe(`Find $\\frac{dy}{dx}$ and $\\frac{d^2y}{dx^2} for the following expressions:`);
	expect(formatted[98]).toBe(EMPTY);
	expect(formatted[99]).toBe('1.');
	expect(formatted[100]).toBe(`$$y = 17x + 12x^2$$`);
	expect(formatted[101]).toBe('2.');
	expect(formatted[102]).toBe(`$$y = \\frac{x^2 + a}{x + a}$$`);
	expect(formatted[103]).toBe('3.');
	expect(formatted[104]).toBe(`$$y = 1 + \\frac{x}{1} + \\frac{x^2}{1 \\times 2} + \\frac{x^3}{1 \\times 2 \\times 3} + \\frac{x^4}{1 \\times 2 \\times 3 \\times 4}$$`);
});
