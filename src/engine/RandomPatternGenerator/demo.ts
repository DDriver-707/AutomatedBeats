// Demo script to show sample outputs for each genre with seed 12345
import { generatePattern } from './index';

console.log('='.repeat(80));
console.log('RandomPatternGenerator - Sample Outputs (seed=12345)');
console.log('='.repeat(80));

function printPattern(pattern: ReturnType<typeof generatePattern>, genre: string) {
  console.log(`\n${genre.toUpperCase()} Pattern:`);
  console.log(`Steps per bar: ${pattern.stepsPerBar}`);
  
  ['kick', 'snare', 'clap', 'hihat', 'openHat', 'bass'].forEach(instrument => {
    const track = pattern[instrument as keyof typeof pattern] as number[];
    const hits = track.map((v, i) => v !== 0 ? `${i}` : '.').join(' ');
    const count = track.filter(v => v !== 0).length;
    console.log(`  ${instrument.padEnd(8)}: [${hits}] (${count} hits)`);
  });
}

const seed = 12345;

printPattern(generatePattern('trap', seed, {}), 'trap');
printPattern(generatePattern('lofi', seed, {}), 'lofi');
printPattern(generatePattern('house', seed, {}), 'house');

console.log('\n' + '='.repeat(80));
console.log('Determinism check: Running trap pattern twice with same seed...');
const trap1 = generatePattern('trap', seed, {});
const trap2 = generatePattern('trap', seed, {});
console.log('Patterns match:', JSON.stringify(trap1) === JSON.stringify(trap2));
console.log('='.repeat(80));
