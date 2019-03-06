node_modules/.bin/jest --coverage --coverageReporters=text-lcov | coveralls;
exit ${PIPESTATUS[0]}

