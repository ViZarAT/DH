"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const CHOOSABLE_TARGETS = new Set(['normal', 'any', 'adjacentAlly', 'adjacentAllyOrSelf', 'adjacentFoe']);

 const Scripts = {
	init: function() {

		this.modData('Learnsets', 'glastrier').learnset.falsesurrender = ['8L1'];
		this.modData('Learnsets', 'glastrier').learnset.fellstinger = ['8L1'];
		this.modData('Learnsets', 'glastrier').learnset.vinewhip = ['8L1'];
		this.modData('Learnsets', 'glastrier').learnset.powerwhip = ['8L1'];
		this.modData('Learnsets', 'glastrier').learnset.trickroom = ['8L1'];
		this.modData('Learnsets', 'glastrier').learnset.spectralthief = ['8L1'];
		this.modData('Learnsets', 'glastrier').learnset.glaciallance = ['8L1'];
		
		this.modData('Learnsets', 'spectrier').learnset.falsesurrender = ['8L1'];
		this.modData('Learnsets', 'spectrier').learnset.fellstinger = ['8L1'];
		this.modData('Learnsets', 'spectrier').learnset.spectralthief = ['8L1'];
		this.modData('Learnsets', 'spectrier').learnset.highhorsepower = ['8L1'];
		this.modData('Learnsets', 'spectrier').learnset.wonderroom = ['8L1'];
		this.modData('Learnsets', 'spectrier').learnset.astralbarrage = ['8L1'];
		this.modData('Learnsets', 'spectrier').learnset.vinewhip = ['8L1'];
		this.modData('Learnsets', 'spectrier').learnset.powerwhip = ['8L1'];
		
		this.modData('Learnsets', 'regieleki').learnset.charge = ['8L1'];
		this.modData('Learnsets', 'regieleki').learnset.magneticflux = ['8L1'];
		this.modData('Learnsets', 'regieleki').learnset.gearup = ['8L1'];
		this.modData('Learnsets', 'regieleki').learnset.taunt = ['8L1'];
		
		this.modData('Learnsets', 'regidrago').learnset.magneticflux = ['8L1'];
		this.modData('Learnsets', 'regidrago').learnset.gearup = ['8L1'];
		this.modData('Learnsets', 'regidrago').learnset.taunt = ['8L1'];
		
		this.modData('Learnsets', 'articunogalar').learnset.roost = ['8L1'];
		
		this.modData('Learnsets', 'zapdosgalar').learnset.roost = ['8L1'];
		delete this.modData('Learnsets', 'zapdosgalar').learnset.closecombat;
		
		this.modData('Learnsets', 'moltresgalar').learnset.roost = ['8L1'];
		this.modData('Learnsets', 'moltresgalar').learnset.powertrip = ['8L1'];
		
		this.modData('Learnsets', 'froslass').learnset.focusenergy = ['8L1'];
		this.modData('Learnsets', 'froslass').learnset.flipturn = ['8L1'];
		this.modData('Learnsets', 'froslass').learnset.partingshot = ['8L1'];
	},
	

	
	getMaxMove(move, pokemon) {
		if (typeof move === 'string') move = this.dex.getMove(move);
		if (move.name === 'Struggle') return move;
		if (pokemon.gigantamax && pokemon.canGigantamax && move.category !== 'Status') {
			const gMaxSpecies = this.dex.getSpecies(pokemon.species.name + '-Gmax');
			if (gMaxSpecies.gMaxMoves) {
				for (const thisMove in gMaxSpecies.gMaxMoves) {
					const gMaxMove = this.dex.getMove(gMaxSpecies.gMaxMoves[thisMove]);
					if (gMaxMove.exists && gMaxMove.type === move.type) return gMaxMove;
				}
			}
			else {
				const gMaxMove = this.dex.getMove(gMaxSpecies.isGigantamax);
				if (gMaxMove.exists && gMaxMove.type === move.type) return gMaxMove;
			}
			
		}
		const maxMove = this.dex.getMove(this.maxMoveTable[move.category === 'Status' ? move.category : move.type]);
		if (maxMove.exists) return maxMove;
	},

	getActiveMaxMove(move, pokemon) {
		if (typeof move === 'string') move = this.dex.getActiveMove(move);
		if (move.name === 'Struggle') return this.dex.getActiveMove(move);
		let maxMove = this.dex.getActiveMove(this.maxMoveTable[move.category === 'Status' ? move.category : move.type]);
		if (move.category !== 'Status') {
			
			if (pokemon.gigantamax && pokemon.canGigantamax) {
				const gMaxSpecies = this.dex.getSpecies(pokemon.species.name + '-Gmax');
				if (gMaxSpecies.gMaxMoves) {
					for (const thisMove in gMaxSpecies.gMaxMoves) {
						const gMaxMove = this.dex.getActiveMove(gMaxSpecies.gMaxMoves[thisMove]);
						if (gMaxMove.exists && gMaxMove.type === move.type) maxMove = gMaxMove;
					}
				}
				else {
					const gMaxMove = this.dex.getActiveMove(gMaxSpecies.isGigantamax ? gMaxSpecies.isGigantamax : '');
					if (gMaxMove.exists && gMaxMove.type === move.type) maxMove = gMaxMove;
				}
			}
			if (!_optionalChain([move, 'access', _ => _.maxMove, 'optionalAccess', _2 => _2.basePower])) throw new Error(`${move.name} doesn't have a maxMove basePower`);
			maxMove.basePower = move.maxMove.basePower;
			if (['gmaxdrumsolo', 'gmaxfireball', 'gmaxhydrosnipe'].includes(maxMove.id)) maxMove.basePower = 160;
			maxMove.category = move.category;
		}
		maxMove.baseMove = move.id;
		// copy the priority for Psychic Terrain, Quick Guard
		maxMove.priority = move.priority;
		maxMove.isZOrMaxPowered = true;
		return maxMove;
	},
	
	
	hitStepStealBoosts(targets, pokemon, move) {
		const target = targets[0]; // hardcoded
		if (move.stealsBoosts) {
			const boosts = {};
			let stolen = false;
			let statName;
			for (statName in target.boosts) {
				const stage = target.boosts[statName];
				if (stage > 0) {
					boosts[statName] = stage;
					stolen = true;
				}
			}
			if (stolen) {
				this.attrLastMove('[still]');
				this.add('-clearpositiveboost', target, pokemon, 'move: ' + move.name);
				this.boost(boosts, pokemon, pokemon);

				let statName2;
				for (statName2 in boosts) {
					boosts[statName2] = 0;
				}
				target.setBoost(boosts);
				this.addMove('-anim', pokemon, "Spectral Thief", target);
			}
		}

		if (move.swapsBoosts) {
			const boosts = {};
			let swapped = false;
			const targetBoosts = {};
			const sourceBoosts = {};

			let i;
			for (i in target.boosts) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = pokemon.boosts[i];
				swapped = true;
			}

			if (swapped) {
				this.attrLastMove('[still]');
				this.add('-swapboost', pokemon, target, '[from] move: Spectral Trick');
				
				target.setBoost(sourceBoosts);
				pokemon.setBoost(targetBoosts);
				
				this.addMove('-anim', pokemon, "Spectral Thief", target);
			}
		}
		return undefined;
	},
}; exports.Scripts = Scripts;