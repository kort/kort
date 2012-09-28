/**
 * @author Bei ZHANG
 * Range Minimum Query provides you to query the minimum/maximum value of a sub-array of numbers very quickly:
 *
 *     +---------------+------------+------------+---------+
 *     |   Algorithm   |  Pre Time  | Query Time |  Space  |
 *     +---------------+------------+------------+---------+
 *     | Segment tree  |    O(n)    |  O(logn)   |  O(n)   |
 *     +---------------+------------+------------+---------+
 *     |  Sparse tree  |  O(nlogn)  |    O(1)    | O(nlogn)|
 *     +---------------+------------+------------+---------+
 *     |     RMQ±1     |    O(n)    |    O(1)    |  O(n)   |
 *     +---------------+------------+------------+---------+
 *     |    Linear     |    O(n)    |    O(1)    |  O(n)   |
 *     +---------------+------------+------------+---------+
 *
 * RMQ&plusmn;1 requires the 1st order difference of the data to be either +1 or -1.
 * Linear RMQ is based on the Cartesian tree expansion of the data.
 *
 * Ref:
 * 
 * - [Range Minimum Query - Wikipedia](http://en.wikipedia.org/wiki/Range_Minimum_Query)
 * - [Range minimum query - PEGWiki](http://wcipeg.com/wiki/RMQ)
 */
Ext.define("Ext.draw.RMQ", {
    rmq: null,
    constructor: function (data) {
        this.rmq = new Ext.draw.RMQLinear(data);
    },

    queryIndex: function (from, to) {
        return this.rmq.queryIndex(from, to);
    },

    query: function (from, to) {
        var minmax = this.rmq.query(from, to);
        return {
            min: this.rmq.data[minmax.min],
            max: this.rmq.data[minmax.max]
        };
    },

    destroy: function () {
        this.rmq.destroy();
        delete this.rmq;
    }
});

Ext.define("Ext.draw.RMQSegTree", {
    minData: null,
    maxData: null,
    // minSamples[starts[i-1] + j] = minSamples[i][j] = [j * (1 << i), (j + 1) * (1 << i) - 1]
    minSamples: null,
    maxSamples: null,
    starts: null,

    constructor: function (minData, maxData) {
        // Initialize data. If only the min data is presented, use it as max data too.
        if (!(minData instanceof Float32Array)) {
            this.minData = minData = new Float32Array(minData);
        } else {
            this.minData = minData;
        }
        if (!maxData) {
            maxData = minData;
        }
        if (!(maxData instanceof Float32Array)) {
            this.maxData = maxData = new Float32Array(maxData);
        } else {
            this.maxData = maxData;
        }

        var length = minData.length,
        // The size of the sample would be (length + number of '1's in length - 2).
            minSamples = this.minSamples = new Float32Array(length + 32),
            maxSamples = this.maxSamples = new Float32Array(length + 32),
            starts = this.starts = [0],
            testMin, testMax, lastLength, start, lastStart, lastPosition, i, j;

        lastLength = length;
        length = (length + 1) >> 1;
        start = 0;
        // 1st slicing.
        for (i = 0; i < length; i++) {
            lastPosition = i + i;
            testMin = testMax = minSamples[i] = maxSamples[i] = lastPosition;
            lastPosition++;
            if (lastPosition < lastLength) {
                if (minData[testMin] > minData[lastPosition]) {
                    minSamples[i] = lastPosition;
                }
                if (maxData[testMax] < maxData[lastPosition]) {
                    maxSamples[i] = lastPosition;
                }
            }
        }
        lastLength = length;
        length = (length + 1) >> 1;
        j = i;
        lastStart = 0;
        while (length >= 1) {
            lastStart = start;
            start = j;
            starts.push(j);
            for (i = 0; i < length; i++, j++) {
                lastPosition = lastStart + i + i;
                testMin = minSamples[j] = minSamples[lastPosition];
                testMax = maxSamples[j] = maxSamples[lastPosition];
                lastPosition++;
                if (lastPosition < lastStart + lastLength) {
                    if (minData[testMin] > minData[minSamples[lastPosition]]) {
                        minSamples[j] = minSamples[lastPosition];
                    }
                    if (maxData[testMax] < maxData[maxSamples[lastPosition]]) {
                        maxSamples[j] = maxSamples[lastPosition];
                    }
                }
            }
            lastLength = length;
            if (length === 1) {
                break;
            }
            length = (length + 1) >> 1;
        }
    },
    /**
     * Query in range [from, to)
     * @private
     * @param from
     * @param to from < to
     * @param level
     */
    queryRange: function (from, to, level) {
        var minData = this.minData,
            maxData = this.maxData,
            min, max, minIdx, maxIdx, minMax,
            testMin, testMax;
        if (level === 0) {
            minIdx = from;
            maxIdx = from;
        } else {
            minIdx = this.minSamples[this.starts[level - 1] + from];
            maxIdx = this.maxSamples[this.starts[level - 1] + from];
        }
        min = minData[minIdx];
        max = maxData[minIdx];

        if (((from + 1) >> 1) < (to >> 1)) {
            // Query the upper level.
            minMax = this.queryRange(((from + 1) >> 1), (to >> 1), level + 1);
            testMin = minMax.min;
            testMax = minMax.max;
            if (min > minData[testMin]) {
                min = minData[minIdx = testMin];
            }
            if (max < maxData[testMax]) {
                max = maxData[maxIdx = testMax];
            }
        }
        //noinspection JSBitwiseOperatorUsage
        if (to & 1) { // Bitwise
            if (level) {
                testMin = this.minSamples[this.starts[level - 1] + to - 1];
                testMax = this.maxSamples[this.starts[level - 1] + to - 1];
            } else {
                testMin = testMax = to - 1;
            }
            if (min > minData[testMin]) {
                minIdx = testMin;
            }
            if (max < maxData[testMax]) {
                maxIdx = testMax;
            }
        }
        return {
            min: minIdx,
            max: maxIdx
        };
    },
    queryIndex: function (from, to) {
        if (from > to) {
            return this.queryIndex(to, from);
        } else if (from === to) {
            return {min: from, max: from};
        } else {
            to++;
            var level = Math.ceil(Math.log(to - from) / Math.log(2));
            if (level > 0 && (from >> level << level) === from && (to >> level << level) === to) {
                // Use as mipmap
                if (from + (1 << level) === to) {
                    from = this.starts[level - 1] + (from >> level);
                    return {
                        min: this.minSamples[from],
                        max: this.maxSamples[from]
                    };
                }
                return this.queryRange(from >> level, to >> level, level);
            } else {
                return this.queryRange(from, to, 0);
            }
        }
    },

    query: function (from, to) {
        var idx = this.queryIndex(from, to);
        return {
            min: this.minData[idx.min],
            max: this.maxData[idx.max]
        };
    },

    destroy: function () {
        delete this.minData;
        delete this.maxData;
        delete this.minSamples;
        delete this.maxSamples;
    }
});

/**
 * @private
 * A RMQ implementation using sparse tree.
 * This is a minimum only rmq.
 */
Ext.define("Ext.draw.RMQSparse", {
    data: null,
    samples: null,
    constructor: function (data) {
        var length = data.length,
            sampleCount = Math.ceil(Math.log(length) / Math.log(2)) + 1,
            samples, i, j, size, block, lastStart, start, lastSamples, cacheIndex, samplesBuffer;

        if (!(data instanceof Int32Array)) {
            this.data = data = new Int32Array(data);
        } else {
            this.data = data;
        }
        samplesBuffer = new Int32Array(sampleCount * length);

        this.samples = [];
        samples = this.samples[0] = samplesBuffer.subarray(0, length);
        for (i = 0; i < length; i++) {
            samples[i] = i;
        }
        lastStart = length;
        start = length + length;
        for (size = 1, block = 1; size < length; size += size, block++, lastStart = start, start += length) {
            lastSamples = samples;
            samples = this.samples[block] = samplesBuffer.subarray(lastStart, start);
            samples.set(lastSamples, 0);
            for (i = 0, j = size; j < length; i++, j++) {
                cacheIndex = samples[j];
                if (data[cacheIndex] < data[samples[i]]) {
                    samples[i] = cacheIndex;
                }
            }
        }
    },

    queryIndex: function (from, to) {
        if (from > to) {
            return this.queryIndex(to, from);
        } else if (from === to) {
            return from;
        } else {
            var block = Math.ceil(Math.log(to - from + 2) / Math.log(2) - 1),
                length = 1 << block,
                samples = this.samples[block],
                minData = this.data,
                minIdx = samples[from];
            if (minData[minIdx] > minData[samples[to - length + 1]]) {
                minIdx = samples[to - length + 1];
            }
            return minIdx;
        }
    },

    query: function (from, to) {
        return this.data[this.queryIndex(from, to)];
    },

    destroy: function () {
        delete this.data;
        delete this.samples;
    }
});

/**
 * Cartesian tree is a binary heap represented in an array that any left sub tree of a node comes before
 * the node in the array.
 *
 * As the order of the number is preserved in Cartesian tree, the LCA of two nodes will give you the RMQ of them.
 *
 * For more information, see [http://wcipeg.com/wiki/Cartesian_tree](http://wcipeg.com/wiki/Cartesian_tree).
 *
 * @private
 */
Ext.define("Ext.draw.CartesianTree", {
    data: null,
    indexMax: null,
    reverseMax: null,
    depthMax: null,
    indexMin: null,
    reverseMin: null,
    depthMin: null,

    constructor: function (data) {
        if (!(data instanceof Float32Array)) {
            this.data = data = new Float32Array(data);
        } else {
            this.data = data;
        }
        var length = data.length,
            samplesBuffer = new Int32Array(8 * length),
            dataBuffer = new Int32Array(10 * length),
            leftMin = samplesBuffer.subarray(0, length),
            rightMin = samplesBuffer.subarray(length, length * 2),
            leftMax = samplesBuffer.subarray(length * 2, length * 3),
            rightMax = samplesBuffer.subarray(length * 3, length * 4),
            tempStack = samplesBuffer.subarray(length * 4, length * 8),
            rootMin = this.process(data, leftMin, rightMin, true, tempStack),
            rootMax = this.process(data, leftMax, rightMax, false, tempStack);

        this.traverse(rootMin, leftMin, rightMin,
            this.indexMin = dataBuffer.subarray(0, length * 2 - 1),
            this.depthMin = dataBuffer.subarray(length * 2 - 1, length * 4 - 2),
            this.reverseMin = dataBuffer.subarray(length * 4 - 2, length * 5 - 2),
            tempStack
        );
        this.traverse(rootMax, leftMax, rightMax,
            this.indexMax = dataBuffer.subarray(length * 5 - 2, length * 7 - 3),
            this.depthMax = dataBuffer.subarray(length * 7 - 3, length * 9 - 4),
            this.reverseMax = dataBuffer.subarray(length * 9 - 4, length * 10 - 4),
            tempStack
        );
    },

    process: function (data, left, right, min, stack) {
        var length = data.length,
            root = 0,
            stackPos = 0,
            value, i, top;

        left[0] = right[0] = -1;
        stack[stackPos++] = 0;
        if (min) {
            for (i = 1; i < length; i++) {
                value = data[i];
                left[i] = right[i] = -1;
                while (stackPos) {
                    top = stack[stackPos - 1];
                    if (data[top] <= value) {
                        left[i] = right[top];
                        right[top] = i;
                        stack[stackPos++] = i;
                        break;
                    } else {
                        stackPos--;
                    }
                }
                if (stackPos === 0) {
                    left[i] = root;
                    root = i;
                    stack[stackPos++] = i;
                }
            }
        } else {
            for (i = 1; i < length; i++) {
                value = data[i];
                left[i] = right[i] = -1;
                while (stackPos) {
                    top = stack[stackPos - 1];
                    if (data[top] >= value) {
                        left[i] = right[top];
                        right[top] = i;
                        stack[stackPos++] = i;
                        break;
                    } else {
                        stackPos--;
                    }
                }
                if (stackPos === 0) {
                    left[i] = root;
                    root = i;
                    stack[stackPos++] = i;
                }
            }
        }
        return root;
    },

    traverse: function (root, left, right, index, list, reverse, nodeStack) {
        var i = 0,
            depth = 0,
            stackPos = 0,
            status, node;

        nodeStack[stackPos++] = root;
        nodeStack[stackPos++] = 0;
        reverse[root] = 0;
        while (stackPos) {
            status = nodeStack[--stackPos];
            node = nodeStack[--stackPos];
            switch (status) {
                case 0:
                    reverse[node] = i;
                    index[i] = node;
                    list[i] = depth;
                    i++;
                    if (left[node] !== -1) {
                        depth++;
                        nodeStack[stackPos++] = node;
                        nodeStack[stackPos++] = 1;
                        nodeStack[stackPos++] = left[node];
                        nodeStack[stackPos++] = 0;
                    } else if (right[node] !== -1) {
                        depth++;
                        nodeStack[stackPos++] = node;
                        nodeStack[stackPos++] = 2;
                        nodeStack[stackPos++] = right[node];
                        nodeStack[stackPos++] = 0;
                    } else {
                        depth--;
                    }
                    break;
                case 1:
                    index[i] = node;
                    list[i] = depth;
                    i++;
                    if (right[node] !== -1) {
                        depth++;
                        nodeStack[stackPos++] = node;
                        nodeStack[stackPos++] = 2;
                        nodeStack[stackPos++] = right[node];
                        nodeStack[stackPos++] = 0;
                    } else {
                        depth--;
                    }
                    break;
                case 2:
                    index[i] = node;
                    list[i] = depth;
                    i++;
                    depth--;
                    break;
            }
        }
    },

    destroy: function () {
        delete this.data;
        delete this.indexMax;
        delete this.reverseMax;
        delete this.depthMax;
        delete this.indexMin;
        delete this.reverseMin;
        delete this.depthMin;
    }
})
;

// RMQ+-1
Ext.define("Ext.draw.RMQPM", {
    statics: {
        rmqCache: []
    },
    data: null,
    blockRmq: null,
    blockMins: null,
    blockSize: 0,
    blockCache: null,
    constructor: function (data) {
        if (!(data instanceof Int32Array)) {
            this.data = data = new Int32Array(data);
        } else {
            this.data = data;
        }
        var length = data.length,
            rmqCache = Ext.draw.RMQPM.rmqCache,
            blockSize = this.blockSize = Math.ceil(Math.log(length) / Math.log(2) / 2),
            blockCount = Math.ceil(length / blockSize),
            blockCache = this.blockCache = new Array(blockCount),
            blockMins = this.blockMins = new Int32Array(blockCount),
            mins = new Int32Array(blockCount),
            min, minIdx, i, j, start, value, size, blockId;
        if (blockSize < 2) {
            throw "Data set too small (must be more than 16 points)";
        }

        for (i = 0, start = 0; start < length; i++, start += blockSize) {
            minIdx = start;
            min = data[minIdx];
            blockId = 0;
            size = Math.min(start + blockSize, length);
            value = data[start];
            if (value < min) {
                minIdx = start;
                min = value;
            }
            for (j = start + 1; j < size; j++) {
                blockId <<= 1;
                if (data[j] > data[j - 1]) {
                    blockId |= 1;
                }
                value = data[j];
                if (value < min) {
                    minIdx = j;
                    min = value;
                }
            }
            size -= start;
            if (!rmqCache[size]) {
                rmqCache[size] = [];
            }
            blockCache[i] = rmqCache[size][blockId] || (rmqCache[size][blockId] = this.precalcBlock(blockId, size));
            blockMins[i] = minIdx;
            mins[i] = min;
        }
        this.blockRmq = new Ext.draw.RMQSparse(mins);
    },

    precalcBlock: function (blockId, size) {
        var sample = new Int32Array(size),
            result = [],
            i, j, min, minIdx, res;
        for (i = size - 2; i >= 0; i--) {
            if ((blockId & 1)) {
                sample[i] = sample[i + 1] - 1;
            } else {
                sample[i] = sample[i + 1] + 1;
            }
            blockId >>= 1;
        }

        for (i = 0; i < size; i++) {
            result[i] = [];
            minIdx = i;
            min = sample[minIdx];
            res = result[i];
            res[i] = minIdx;
            for (j = i + 1; j < size; j++) {
                if (sample[j] < min) {
                    minIdx = j;
                    min = sample[minIdx];
                }
                res[j] = minIdx;
            }
        }
        for (i = 1; i < size; i++) {
            res = result[i];
            for (j = 0; j < i; j++) {
                res[j] = result[j][i];
            }
        }
        return result;
    },

    queryIndex: function (from, to) {
        if (from === to) {
            return from;
        } else if (from > to) {
            return this.queryIndex(to, from);
        } else {
            var data = this.data,
                blockSize = this.blockSize,
                blockMins = this.blockMins,
                blockRmq = this.blockRmq,
                blockCache = this.blockCache,
                startBlock = Math.ceil(from / blockSize),
                toBlock = Math.floor((to + 1) / blockSize) - 1, // [-1 ~ blockSize-2] -> -1, [blockSize-1~blockSize*2-2] ->0
                blockIdx, cache, minTest, min = from,
                minBlock, startBlockEnd, endBlockStart;
            if (startBlock <= toBlock + 1) {
                if (startBlock <= toBlock) {
                    minBlock = blockMins[blockRmq.queryIndex(startBlock, toBlock)];
                    if (data[minBlock] < data[min]) {
                        min = minBlock;
                    }
                }
                // Before blocks
                startBlockEnd = Math.min(data.length, startBlock * blockSize - 1);
                if (from <= startBlockEnd) {
                    blockIdx = Math.floor(from / blockSize);
                    cache = blockCache[blockIdx];
                    from -= blockIdx * blockSize;
                    minTest = blockIdx * blockSize + cache[from][cache[from].length - 1];
                    if (data[minTest] <= data[min]) {
                        min = minTest;
                    }
                }
                // After blocks
                endBlockStart = (toBlock + 1) * blockSize;
                if (endBlockStart <= to) {
                    blockIdx = toBlock + 1;
                    cache = blockCache[blockIdx];
                    minTest = blockIdx * blockSize + cache[0][to - endBlockStart];
                    if (data[minTest] < data[min]) {
                        min = minTest;
                    }
                }
            } else {
                blockIdx = Math.floor(from / blockSize);
                from -= blockIdx * blockSize;
                to -= blockIdx * blockSize;
                return blockIdx * blockSize + this.blockCache[blockIdx][from][to];
            }
            return min;
        }
    },

    query: function (from, to) {
        var minMax = this.queryIndex(from, to);
        return {min: this.data[minMax.min], max: this.data[minMax.max]};
    },

    destroy: function () {
        delete this.blockCache;
        delete this.blockMins;
        this.blockRmq.destroy();
        delete this.blockRmq;
    }
});

Ext.define("Ext.draw.RMQLinear", {
    data: [],
    tree: null,
    minRmqpm: null,
    maxRmqpm: null,

    constructor: function (data) {
        if (!(data instanceof Float32Array)) {
            this.data = data = new Float32Array(data);
        } else {
            this.data = data;
        }
        var tree = this.tree = new Ext.draw.CartesianTree(data);
        this.minRmqpm = new Ext.draw.RMQPM(tree.depthMin);
        this.maxRmqpm = new Ext.draw.RMQPM(tree.depthMax);
    },

    queryIndex: function (from, to) {
        if (from > to) {
            return this.queryIndex(to, from);
        } else if (from === to) {
            return {min: from, max: from};
        } else {
            var tree = this.tree;
            return {
                min: tree.indexMin[this.minRmqpm.queryIndex(tree.reverseMin[from], tree.reverseMin[to])],
                max: tree.indexMax[this.maxRmqpm.queryIndex(tree.reverseMax[from], tree.reverseMax[to])]
            };
        }
    },

    query: function (from, to) {
        var minMax = this.queryIndex(from, to);
        return {min: this.data[minMax.min], max: this.data[minMax.max]};
    },

    destroy: function () {
        this.tree.destroy();
        this.minRmqpm.destroy();
        this.maxRmqpm.destroy();
        delete this.tree;
        delete this.minRmqpm;
        delete this.maxRmqpm;
    }
});