export const RULES={like:{count:1,size:'small',label:'点赞'},heart:{count:1,size:'large',priority:true,label:'爱心'},beer:{count:2,size:'large',priority:true,label:'啤酒'},lollipop:{count:3,size:'large',priority:true,label:'棒棒糖'},other:{count:1,size:'large',priority:true,label:'礼物'}};
export const LIKES_PER_PRINT = 30;

export class LiveLikeCounter {
 constructor() { this.room = ''; this.counts = new Map(); }
 setRoom(room) {
  if (room === this.room) return;
  this.room = room;
  this.counts.clear();
 }
 add({userId, room, count}) {
  if (!userId || !Number.isSafeInteger(count) || count <= 0) return 0;
  this.setRoom(String(room || ''));
  const total = (this.counts.get(userId) || 0) + count;
  const remainder = total % LIKES_PER_PRINT;
  if (remainder) this.counts.set(userId, remainder);
  else this.counts.delete(userId);
  return Math.floor(total / LIKES_PER_PRINT);
 }
}

export class DemoRules{
 constructor(){this.queue=[];this.likes=new Map();this.seen=new Set();this.follows=new Set()}
 recordLike(user) {
  const progress = ((this.likes.get(user) || 0) + 1) % LIKES_PER_PRINT;
  if (progress) this.likes.set(user, progress);
  else this.likes.delete(user);
  return progress;
 }
 event(type,user,id,amount=1,options={}){if(!RULES[type])throw Error('未知规则');if(!user?.name)throw Error('缺少用户');if(!Number.isInteger(amount)||amount<1||amount>100)throw Error('演示单次数量应为1到100');if(id&&this.seen.has(id))return {added:0,duplicate:true};if(id)this.seen.add(id);const rule={...RULES[type],...options},count=rule.count*amount;const jobs=Array.from({length:count},(_,i)=>({...user,size:rule.size,priority:!!rule.priority,source:rule.label,copy:i+1,total:count}));let index=this.queue.length;if(rule.priority){index=this.queue.findIndex(j=>!j.priority);if(index<0)index=this.queue.length}this.queue.splice(index,0,...jobs);return {added:count,size:rule.size,index,jobs}}
}
