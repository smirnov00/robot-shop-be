import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getArgument = (argName, defaultValue, parser = (value) => value) => {
  const argument = process.argv.find(arg => arg.startsWith(`--${argName}=`));

  if (!argument) {
    return defaultValue;
  }
  
  const [, argValue] = argument.split('=');
  return parser(argValue);
}

const OUTPUT_FORMAT = getArgument('format', 'csv', (format) => ['cvs', 'json'].includes(format) ? format : 'csv'); // csv || json
const NUM_ROWS = getArgument('rows', 32, parseInt);
const COUNT_LIMITS = [2, 16]; // [min, max]
const PRICE_LIMITS = [500, 2000]; // [min, max]
const CSV_SEPARATOR = ',';

const randomizeWithinLimits = ([min, max], precision = 0) => {
  const randNumber = min + Math.random() * (max - min);
  return parseFloat(randNumber.toFixed(precision));
};

fs.readFile(path.join(__dirname, './MOCK_DATA.json'), 'utf8', (err, data) => {
  if (err) {
    return console.error(err);
  }

  const res = JSON.parse(data)
  .sort(() => Math.random() - 0.5)
  .filter((_, i) => i < NUM_ROWS)
  .map(({ id, title, description }) => ({
    id,
    title,
    description,
    count: randomizeWithinLimits(COUNT_LIMITS),
    price: randomizeWithinLimits(PRICE_LIMITS, 2),
  }));

  let outputContent;
  switch (OUTPUT_FORMAT) {
    case 'json':
      outputContent = JSON.stringify(res);
      break;
    case 'csv':
      const keys = Object.keys(res[0]);      
      outputContent = [
        keys.join(CSV_SEPARATOR),
        ...res.map((entry) => keys.map((key) => entry[key]).join(CSV_SEPARATOR))
      ].join('\r\n');
      break;
    default:
      throw new Error(`Unsupported output format: ${OUTPUT_FORMAT}`);
  }

  const outputFileName = path.join(__dirname, `./data-set.${OUTPUT_FORMAT}`);

  fs.writeFileSync(outputFileName, outputContent, 'utf8');
  console.log(`${NUM_ROWS} entries has been generated and stored to ${outputFileName}`);
});
